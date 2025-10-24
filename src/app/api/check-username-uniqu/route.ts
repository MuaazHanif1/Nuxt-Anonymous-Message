import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { userNameSchema } from "@/schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: userNameSchema,
});

export async function GET(request: Request) {
  try {
    await dbConnect();
    //console.log("connection", connection);

    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    const result = UsernameQuerySchema.safeParse(queryParams);
    if (!result.success) {
      const errorArray = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message: errorArray.length > 0 ? errorArray.join(", ") : "Invalid Query Parameter",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await userModel.findOne({ username, isVarified: true });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "User Already Taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 }
    );
  } catch (err) {
    return Response.json(
      {
        success: false,
        message: "Error: While Checking UserName",
      },
      { status: 500 }
    );
  }
}
