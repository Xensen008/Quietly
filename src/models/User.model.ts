import mongoose , {Schema, Document} from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {type: String, required: true},
    createdAt: {type: Date,default: Date.now, required: true}     
});
 


export interface User extends Document {
    username: string;
    email: string;
    password: string;
    messages: Message[];
    verifyCode: string;
    verifyCodeExpires: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
}       

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true,
        unique: true,
        match:[/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String, 
        required: [true, 'Password is required']},
    messages: [MessageSchema],
    verifyCode: {
        type: String, 
        required: true
    },
    verifyCodeExpires: {
        type: Date, 
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessages: {
        type: Boolean,
        default: false,
    }
});     

// export default mongoose.models.User || mongoose.model<User>('User',UserSchema);

// export const MessageModel = mongoose.models.Message || mongoose.model<Message>('Message', MessageSchema);

const UserModel =  (mongoose.models.User as  mongoose.Model<User>) || mongoose.model<User>('User',UserSchema);

export default UserModel;