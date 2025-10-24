import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingUserVerifiedByUsername = await userModel.findOne({ username, isVarified: true });
    if (existingUserVerifiedByUsername) {
      return Response.json({ success: false, message: "Username is already taken" }, { status: 400 });
    }

    const existingByEmail = await userModel.findOne({ email });
    const verifyCode = String(Math.floor(100000 + Math.random() * 900000)); // 6-digit
    if (existingByEmail) {
      if (existingByEmail.isVarified) {
        return Response.json({ success: false, message: "User with this email is Already Exist" }, { status: 400 });
      } else {
        const hasedPassword = await bcrypt.hash(password, 10);
        existingByEmail.password = hasedPassword;
        existingByEmail.verifyCode = verifyCode;
        existingByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingByEmail.save();
      }
    } else {
      const encryptPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date(Date.now() + 3600000);

      const new_user = new userModel({
        username,
        email,
        password: encryptPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        isVarified: false,
      });

      await new_user.save();
    }

    const responseMessage = await sendVerificationEmail(email, username, verifyCode);
    if (!responseMessage.success) {
      return Response.json({ success: false, message: responseMessage.message }, { status: 402 });
    }

    return Response.json({ success: true, message: "Please Verify Email" }, { status: 200 });
  } catch (error) {
    console.error("Error Registring User :", error);
    return Response.json({ success: false, message: "Error Registering Users" }, { status: 500 });
  }
}
