import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
// Adjust these imports to match exactly where your firebase config lives
import { db } from '@/lib/firebase'; 
import { doc, updateDoc } from 'firebase/firestore';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { documentId, originalPrompt } = await req.json();

    if (!documentId || !originalPrompt) {
      return NextResponse.json({ error: 'Missing documentId or originalPrompt' }, { status: 400 });
    }

    // 1. Initialize Gemini 2.5 Flash
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // 2. Force a unique variation
    const systemInstruction = "You are an expert social media manager. The user rejected the previous draft. Generate a fresh, highly engaging alternative variation of the following request. Do not repeat the previous output.";
    
    // 3. Query the model
    const result = await model.generateContent(`${systemInstruction}\n\nPrompt: ${originalPrompt}`);
    const newContent = result.response.text();

    // 4. Update the exact same document in Firestore
    const docRef = doc(db, 'socialPosts', documentId);
    await updateDoc(docRef, {
      content: newContent,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Regeneration Error:', error);
    // Graceful degradation for 503 traffic spikes
    if (error.status === 503) {
      return NextResponse.json({ error: 'AI models are experiencing high traffic. Please try again.' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
