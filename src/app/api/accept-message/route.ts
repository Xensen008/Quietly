import {getServerSession} from "next-auth";
import dbConnect from "@/lib/dbConnect";
import {User} from 'next-auth';
import UserModel from "@/models/User.model";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not Authenticated Please log in first" 
        },{
            status: 404
        })
    }

    const userId = user._id;
    const {acceptMessages} = await request.json();

    try {
        const updatedUser =  await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessages: acceptMessages},
            {new: true}
        )
        if(!updatedUser){
            return Response.json({
                success: false,
                message: "User not found"
            },{
                status: 404
            }
            )
        }

        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully",
            updatedUser
        },{
            status: 200
        })

    } catch (error) {
        console.error("Error in post accept-message route:", error);
        return Response.json({
            success: false,
            message:"failed to update the user status to update  accept messages"  
        },{
            status: 500
        })
    }

}

export async function GET(request: Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not Authenticated Please log in first"

        },{status: 404})
    }

    const userId = user._id;
    try {
        const foundUser= await UserModel.findById(userId);
        if(!foundUser){
            return Response.json({
                success: false,
                message: "User not found"
            },{
                status: 404
            })
        }
    
        return Response.json({
            success: true,
            message: "User found",
            isAcceptingMessages: foundUser.isAcceptingMessages
        },{
            status: 200
        })
    
    } catch (error) {
        console.error("Error in get accept-message route:", error);
        return Response.json({
            success: false,
            message: "failed to get the user status to accept messages"
        }) 
    }

}