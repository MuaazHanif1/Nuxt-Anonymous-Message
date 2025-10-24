import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    console.log("✅ Received prompt:", prompt);

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

    // ✅ Use v1 model name (not v1beta)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);

    // ✅ Correct way to get text output
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("❌ Gemini API Error (Full):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
