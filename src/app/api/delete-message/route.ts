import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import mongoose from "mongoose";

export async function DELETE(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?._id) {
    return Response.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  try {
    const { messageId } = await request.json();
    if (!messageId) {
      return Response.json({ success: false, message: "Message ID is required" }, { status: 400 });
    }

    const userId = new mongoose.Types.ObjectId(session.user._id as string);

    // 🪓 Pull out the specific message by _id
    console.log("HEREHREHREHRERHEHHREEHRHEHRHR");
    const updatedUser = await userModel.findByIdAndUpdate(userId, { $pull: { messages: { _id: new mongoose.Types.ObjectId(messageId) } } }, { new: true });

    if (!updatedUser) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return Response.json({ success: true, message: "Message deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
