import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }
  const userObjectId = new mongoose.Types.ObjectId(user._id as string);

  try {
    const agg_user = await userModel
      .aggregate([
        { $match: { _id: userObjectId } },
        {
          $unwind: {
            path: "$messages",
            preserveNullAndEmptyArrays: true, // ← this keeps the user even if messages is []
          },
        },
        { $sort: { "messages.createdAt": -1 } },
        { $group: { _id: "$_id", messages: { $push: "$messages" } } },
      ])
      .exec();
    if (!agg_user || agg_user.length == 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 401,
        }
      );
    } else {
      return Response.json(
        {
          success: true,
          messages: agg_user[0].messages,
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.log("An unexpected Error Occure :", error);
    return Response.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
