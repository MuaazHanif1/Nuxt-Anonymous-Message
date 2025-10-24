import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
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
  const userId = user._id;
  const { acceptMessages } = await request.json();
  try {
    const newUpdatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessages,
      },
      { new: true }
    );

    if (!newUpdatedUser) {
      return Response.json({ success: false, message: "faild to update the use accepting message!!" }, { status: 401 });
    } else {
      return Response.json({ success: true, message: "Updating User Message status successfully!", UpdatedUser: newUpdatedUser }, { status: 200 });
    }
  } catch (error) {
    return Response.json({ success: false, message: "failed to update the user status.." }, { status: 500 });
  }
}

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
  try {
    const userId = user._id;
    const foundUser = await userModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "failed to found the user",
        },
        { status: 404 }
      );
    } else {
      return Response.json(
        {
          success: true,
          isAcceptingMessages: foundUser?.isAcceptingMessage,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error In Getting Accepting Message",
      },
      { status: 404 }
    );
  }
}
