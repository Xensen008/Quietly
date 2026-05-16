import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

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

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get('limit') || '9', 10)));

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const result = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ]);

        if (!result || result.length === 0) {
            return Response.json(
                {
                    success: true,
                    messages: [],
                    currentPage: 1,
                    totalPages: 1,
                    totalMessages: 0,
                },
                { status: 200 }
            );
        }

        const allMessages = result[0].messages;
        const totalMessages = allMessages.length;
        const totalPages = Math.ceil(totalMessages / limit);
        const safePage = Math.min(page, totalPages);
        const start = (safePage - 1) * limit;
        const messages = allMessages.slice(start, start + limit);

        return Response.json({
            success: true,
            messages,
            currentPage: safePage,
            totalPages,
            totalMessages,
        },{ status: 200 });
    } catch (_) {
        return Response.json({
            success: false,
            message: "Failed to get messages"
        },{ status: 500 });
    }
}