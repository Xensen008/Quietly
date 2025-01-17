import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    
    console.log('Session:', session);
    console.log('User:', user);
    
    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not Authenticated Please log in first" 
        },{
            status: 401
        })
    }

    if(!user._id) {
        return Response.json({
            success: false,
            message: "User ID not found in session" 
        },{
            status: 400
        })
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            {$match: {_id: userId}},
            {$unwind: "$messages"},
            {$sort: {"messages.createdAt": -1}},
            {$group: {_id: '$_id', messages: {$push: '$messages'}}}
        ])
        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: true,
                    messages: []
                },
                {status: 200}
            )
        }
        return Response.json({
            success: true,
            messages: user[0].messages
        },{
            status: 200 
        })
    } catch (_) {
        return Response.json({
            success:false,
            message: "Failed to get messages"
        },{
            status: 500
        })
    }
}