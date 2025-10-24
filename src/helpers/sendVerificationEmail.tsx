import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Mystry-App <onboarding@resend.dev>",
      to: [email.toLocaleLowerCase()],
      subject: "Mystry Message || Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    if (data?.id) return { success: true, message: "message send Successfully" };
    return { success: false, message: error?.message || "message Sending fail" };
  } catch (error) {
    console.log("Error Send while :", error);
    return { success: false, message: "Fail to send verification Email Message" };
  }
}
