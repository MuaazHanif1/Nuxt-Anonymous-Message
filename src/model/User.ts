import mongoose, { Schema, Document } from "mongoose";

export interface Message {
  _id: string;
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVarified: boolean;
  createdAt: Date;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: { type: String, required: [true, "Name is required"] },
  email: { type: String, required: [true, "Email is required"], unique: true, match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"] },
  password: { type: String, required: [true, "Password is required"] },
  verifyCode: { type: String, required: [true, "Varified code is required!"] },
  createdAt: { type: Date, default: Date.now, required: true },
  isAcceptingMessage: { type: Boolean, default: true },
  messages: { type: [MessageSchema], default: [] },
  verifyCodeExpiry: { type: Date, required: [true, "Varified code expire is required"] },
  isVarified: { type: Boolean, default: false },
});

const userModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default userModel;
