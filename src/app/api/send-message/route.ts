import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();
  const user = await userModel.findOne({ username });
  try {
    if (!user) {
      return Response.json({ success: false, message: "User not found" }, { status: 400 });
    }
    if (!user.isAcceptingMessage) return Response.json({ success: false, message: "User not Accepting the Message" }, { status: 403 });
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json({ success: true, message: "Message Send Successfully" }, { status: 200 });
  } catch (error) {
    console.log("An unexpected Error Occure :", error);
    return Response.json({ success: false, message: "An unexpected Error" }, { status: 500 });
  }
}
