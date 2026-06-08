# ✨ Lumina AI

**A real-time, human-in-the-loop AI agent for social media content generation.**

Lumina AI solves the problem of unpredictable automated generation by offering a seamless "human-in-the-loop" workflow. It bridges robust serverless engineering with high-fidelity design, leveraging Google's Gemini AI to autonomously draft content while requiring human editorial approval before going live.

## 🚀 Live Demo
**[Paste Your Live Vercel Link Here]**

## ✨ Key Features

* **Real-Time Database Syncing:** Prompts are processed by Gemini AI on a serverless backend and streamed instantly to the frontend using Firestore real-time listeners.
* **Human-in-the-Loop Workflow:** An interactive dashboard allows users to review, approve, or discard AI-generated drafts.
* **High-Fidelity UI/UX:** Built with Tailwind CSS and Framer Motion for seamless layout transitions, delivering a premium, market-ready user experience.
* **Serverless Webhook Architecture:** Fully deployed using Vercel (Frontend) and Firebase Cloud Functions (Backend).

## 🛠️ Tech Stack

* **Frontend:** Next.js, React.js, Tailwind CSS, Framer Motion, Lucide Icons
* **Backend:** Node.js, Express.js, Firebase Cloud Functions
* **Database:** Cloud Firestore (NoSQL, Real-time)
* **AI Engine:** Google Gemini 2.5 Flash via `@google/generative-ai`

## ⚙️ How the Architecture Works

1. **Input:** The user submits a prompt via the frontend dashboard.
2. **Webhook Trigger:** The frontend hits an Express endpoint hosted on a Firebase Cloud Function.
3. **AI Processing:** The backend constructs an agentic prompt and queries the Gemini API.
4. **Database Write:** The AI's generated response is securely written to a Firestore collection.
5. **Real-time UI Update:** The Next.js frontend, actively listening via `onSnapshot`, instantly detects the new document and animates the new content onto the screen without a page refresh.

## 🏃‍♂️ Running Locally

### 1. Clone the repository

### 2. Frontend Setup
Navigate to the frontend directory and install dependencies:

Bash
cd frontend
npm install
Create a .env.local file in the frontend directory and add your Firebase configuration securely:

## Code snippet
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
Start the Next.js development server:

## Bash
npm run dev

### 3. Backend Setup
Navigate to the functions directory and install the serverless dependencies:  

## Bash
cd ../functions
npm install
Set up your .env file with your Gemini API key:  

## Code snippet
GEMINI_API_KEY="your-gemini-key"
Start the Firebase emulator to test the webhook locally:  

##Bash
npm run serve
Designed and engineered to bridge the gap between intuitive UI/UX design and scalable full-stack development.
