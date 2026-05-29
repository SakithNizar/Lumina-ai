const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Initialize Firebase Admin (Required for Firestore database)
admin.initializeApp();
const db = admin.firestore();

// Initialize Express Application
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * POST /webhook/social
 * Receives raw text from a webhook and generates a social media post via Gemini.
 */
app.post("/webhook/social", async (req, res) => {
  try {
    // 1. Extract payload (Compatible with Twilio or custom webhooks)
    const rawInput = req.body.Body || req.body.text;
    
    if (!rawInput) {
        return res.status(400).json({ success: false, error: "No text input provided." });
    }

    // 2. Configure Gemini Model and Prompt
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const systemInstruction = `You are an expert social media manager for a local business. 
    Take the raw, short text message provided and turn it into an engaging, professional, 
    and exciting social media post. Include relevant emojis and up to 4 hashtags. 
    Return ONLY the post text.`;

    const prompt = `${systemInstruction}\n\nRaw Text: "${rawInput}"`;

    // 3. Execute AI Generation
    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();

    // 4. Log to Firestore for the UI to consume
    const postRecord = {
      rawInput: rawInput,
      generatedText: generatedText,
      status: "published",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    await db.collection("socialPosts").add(postRecord);

    // 5. Respond to Webhook Provider
    return res.status(200).json({ 
      success: true, 
      message: "Post generated successfully",
      data: postRecord
    });

  } catch (error) {
    console.error("AI Agent Execution Error:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error during AI execution" });
  }
});

// Expose the Express app as a single Firebase Cloud Function
exports.api = functions.https.onRequest(app);
