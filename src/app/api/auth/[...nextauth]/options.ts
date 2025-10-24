import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // Keep the default id "credentials" so client signIn("credentials") matches
      id: "credentials",
      name: "Credentials",
      credentials: {
        // Accept either email or username in a single identifier field
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        console.log("checking password......");
        try {
          if (!credentials?.identifier || !credentials?.password) {
            throw new Error("Missing credentials");
          }

          const identifier = String(credentials.identifier).trim();

          const user = await userModel.findOne({
            $or: [{ email: identifier }, { username: identifier }],
          });
          if (!user) {
            throw new Error("User Not Found With This Email");
          }
          // Require verification before allowing sign-in
          if (!user.isVarified) {
            throw new Error("Please verify your account");
          }

          const isPasswordCorrect = await bcrypt.compare(String(credentials.password), user.password);
          if (isPasswordCorrect) {
            // Normalize to consistent field names expected by session/jwt callbacks
            return {
              _id: user.id,
              email: user.email,
              name: user.username,
              username: user.username,
              isVerified: user.isVarified,
              isAcceptingMessages: user.isAcceptingMessage,
            } as any;
          } else {
            throw new Error("password not match");
          }
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (!session.user) session.user = {} as any;
      if (token) {
        (session.user as any)._id = token._id as any;
        (session.user as any).isVerified = Boolean((token as any).isVerified);
        (session.user as any).isAcceptingMessages = Boolean((token as any).isAcceptingMessages);
        (session.user as any).username = (token as any).username ?? (token as any).name ?? undefined;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const anyUser = user as any;
        token._id = (anyUser._id ?? anyUser.id)?.toString?.() ?? anyUser._id;
        (token as any).isVerified = Boolean(anyUser.isVerified ?? anyUser.isVarified ?? false);
        (token as any).isAcceptingMessages = Boolean(anyUser.isAcceptingMessages ?? anyUser.isAcceptingMessage ?? true);
        (token as any).username = anyUser.username ?? anyUser.name ?? undefined;
      }
      return token;
    },
  },
};
