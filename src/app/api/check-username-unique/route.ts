import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import {z} from 'zod';

import { usernameValidation } from "@/schemas/signupSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){
    if(request.method !== "GET"){
        return Response.json({
            success: false,
            message: "Method not allowed"
        }, {
            status: 405
        })
    }
    await dbConnect();
    try {
        const {searchParams} = new URL(request.url);
        const queryParams = {
            username: searchParams.get("username")
        }

        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParams)
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: usernameErrors?.length > 0 ? usernameErrors.join(',') : "Invalid username"
                },
                {
                    status: 400
                }
            )
        }

        const {username} = result.data;
        const existingVerifiedUser = await UserModel.findOne({
            username: { $regex: new RegExp(`^${username}$`, 'i') },
            isVerified: true
        });

        if(existingVerifiedUser){
           return Response.json(
            {
                success: false,
                message: `Username already taken (${existingVerifiedUser.username})`
            },
            {
                status: 400
            }
           )
        }

        return Response.json(
            {
                success: true,
                message: "Username is available"
            },
            {
                status: 200
            }
           )
    } catch (error) {
        console.error("Error checking username",error)
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {
                status: 500
            }
        )
    }

}