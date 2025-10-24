import userModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { username, code } = await request.json();
    console.log(username, code);
    const decodeUserName = decodeURIComponent(username);

    const findUser = await userModel.findOne({ username: decodeUserName });
    if (!findUser) {
      return Response.json({ message: "User Not found!!" }, { status: 400 });
    }

    const isCodeVerify = findUser.verifyCode === code;
    const isTimeandDateExpireVerify = new Date(findUser.verifyCodeExpiry) > new Date();

    if (!isCodeVerify) {
      return Response.json({ success: false, message: "verify Code not Match!!!" }, { status: 400 });
    }
    if (!isTimeandDateExpireVerify) {
      return Response.json({ success: false, message: "Code is Expired" }, { status: 400 });
    }

    findUser.isVarified = true;
    await findUser.save();
    return Response.json({ success: true, message: "Code is Verified!!!" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json({ success: false, message: "Error: While Checking Verification code" }, { status: 500 });
  }
}
