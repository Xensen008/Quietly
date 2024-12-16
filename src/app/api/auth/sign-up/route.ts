import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const {username, email, password } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        if(existingUserVerifiedByUsername){
            return NextResponse.json(
                {
                    status: false,
                    message: "Username already exists"
                },
                {
                    status: 400
                }
            )
        }

        const existingUserByEmail =await UserModel.findOne({
            email
        });

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return NextResponse.json(
                    {
                        status: false,
                        message: "User already exists with this Email"
                    },
                    {
                        status: 400
                    }
                )
            }else{
                const hashedPassword = await bcrypt.hash(password, 12);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpires = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }

        }else{
            const hashedPassword = await bcrypt.hash(password, 12);
            const expiryDate = new Date(); 
            expiryDate.setHours(expiryDate.getHours() + 1);
            
            const newUser = await new UserModel({
                username,
                email,
                password: hashedPassword,
                messages: [],
                verifyCode ,
                verifyCodeExpires: expiryDate,
                isVerified: false,
                isAcepingMessage: true,
            });

            await newUser.save();
        }
        
        //send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            verifyCode,
            username
        );

        if (!emailResponse.success){
            return Response.json({
                success:false,
                message: emailResponse.message
            },{status: 500})
        }


        return Response.json({
            success:true,
            message: "User Registered Successfully please verify your email"
        },{status: 201})


    } catch (error) {
        console.error("Error Registering User", error);
        return Response.json(
            {
            status: false,
            message: "Error Registering User"
            },
            {
                status: 500
            })
    }
}
