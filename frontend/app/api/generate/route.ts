import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini AI client using the key from your .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    // 1. Grab the prompt sent from your frontend
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // 2. Select the Gemini model (Flash is insanely fast for real-time UIs)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 3. Inject a little "Agentic" behavior behind the scenes
    const systemInstruction = `You are an expert social media manager. Generate engaging, highly readable content based on the following request. Do not include pleasantries, just output the content.\n\nRequest: ${prompt}`;

    // 4. Ask Gemini to generate the text
    const result = await model.generateContent(systemInstruction);
    const generatedText = result.response.text();

    // 5. Send the finished text back to your frontend dashboard
    return NextResponse.json({ success: true, text: generatedText }, { status: 200 });

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong generating the content" }, 
      { status: 500 }
    );
  }
}
