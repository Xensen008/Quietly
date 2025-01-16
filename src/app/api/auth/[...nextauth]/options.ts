import {NextAuthOptions, User} from 'next-auth'
import  CredentialsProvider  from 'next-auth/providers/credentials'
import dbConnect from '@/lib/dbConnect'
import { JWT } from 'next-auth/jwt'
import bcrypt from 'bcryptjs'
import UserModel from '@/models/User.model'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials: {
                identifier: { label: "Email or Username", type: "text" },
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials:any): Promise<any> {
                if (!credentials?.identifier || !credentials?.password) {
                    throw new Error("Missing credentials");
                }
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error("Invalid Credentials or no user found")
                    }

                    if(!user.isVerified){
                        throw new Error("User not verified Please verify your email first")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password) 
                    if (isPasswordCorrect) {
                        return {
                            _id: user?._id?.toString(),
                            email: user?.email,
                            username: user.username,
                            isVerified: user.isVerified,
                            isAcceptingMessages: user.isAcceptingMessages
                        }
                    } else {
                        throw new Error('Password is incorrect')
                    }
                } catch (err: any) {
                    // console.log(err)
                    throw new Error(err.message)
                }
              }
        })
    ],
    callbacks: {
        async redirect({ url, baseUrl }) {
            // Allow verify page access
            if (url.includes('/verify/')) {
                return url;
            }
            
            // Handle successful sign-in
            if (url === `${baseUrl}/sign-in`) {
                return `${baseUrl}/dashboard`;
            }
            
            // Default redirect
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token._id = user._id
                token.isVerified = user.isVerified
                token.email = user.email
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }
            // Handle user updates
            if (trigger === "update" && session) {
                return { ...token, ...session.user }
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user._id = token._id as string
                session.user.email = token.email as string
                session.user.username = token.username as string
                session.user.isVerified = token.isVerified as boolean
                session.user.isAcceptingMessages = token.isAcceptingMessages as boolean
            }
            return session
        }
    },
    pages: {
        signIn: '/sign-in',
        signOut: '/',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.SECRET,
}