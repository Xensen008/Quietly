import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import {z} from 'zod';
import { usernameValidation } from "@/schemas/signupSchema";

export async function POST(request:Request){
    await dbConnect();

    try {
        const {username, code }= await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({
            username: decodedUsername
        })

        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            },{
                status: 404
            })
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpires) > new Date()

        if(isCodeValid && isCodeNotExpired){
            await UserModel.updateOne(
                { _id: user._id },
                { 
                    $set: { isVerified: true },
                    $unset: { 
                        verifyCode: "",
                        verifyCodeExpires: "" 
                    }
                }
            ); 
            return Response.json({
                success: true,
                message: "User verified successfully"
            }, { status: 200 });
        } else if(!isCodeNotExpired){
                return Response.json({
                    success: false,
                    message: "Code has expired Please signup again to get the new code"
                },{
                    status: 400
                })
            
        } else {
            return Response.json({
                success:false,
                message: "Verification code is incorrect"
            },{
                status: 400
            })
        }
 

    } catch (error) {
        console.error("Error in verify-code route: ", error);
        return Response.json({
            success: false,
            message: (error instanceof Error) ? error.message : 'An unknown error occurred'
        },{
            status: 500
        })
    }
}