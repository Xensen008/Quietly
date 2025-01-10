import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { Message } from "@/models/User.model";

export async function POST(request:Request){
    await dbConnect();
    const {username, content} = await request.json();
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success:false,
                message: "User not found"
            },{
                status: 404
            })
        }

        //check user is accepting messages
        if (user.isAcceptingMessages === false){
            return Response.json({
                success:false,
                message: "User is not accepting messages"
            },{
                status: 403
            })
            
        }

        const newMessage = {content, createdAt: new Date()};
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({
            success: true,
            message: "Message sent successfully"
        },{
            status: 200
        })  
    } catch (error) {
        console.error("Error in post send-message route:", error);
        return Response.json({
            success:false,
            message: "Failed to send message" 
        },
    {status: 500})
    }
}