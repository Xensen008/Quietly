import {NextAuthOptions, User} from 'next-auth'
import  CredentialsProvider  from 'next-auth/providers/credentials'
import dbConnect from '@/lib/dbConnect'
import { JWT } from 'next-auth/jwt'
import bcrypt from 'bcryptjs'
import UserModel from '@/models/User.model'

export const  authOptions:NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials: {
                username: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials:any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error("No user found")
                    }

                    if(!user.isVerified){
                        throw new Error("User not verified Please verify your email first")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password) 
                    if (isPasswordCorrect) {
                        return user
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
        async jwt(token: JWT, user?: User): Promise<JWT> {
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
        }
    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.SECRET,
}