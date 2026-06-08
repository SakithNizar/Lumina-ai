## ✨ Lumina AI

**A real-time, human-in-the-loop AI agent for social media content and caption generation.**

Lumina AI solves the problem of unpredictable automated generation by offering a seamless "human-in-the-loop" workflow. It bridges robust serverless engineering with high-fidelity design, leveraging Google's Gemini AI to autonomously draft content while requiring human editorial approval before going live.

## 🚀 Live Demo
**[Live Application on Vercel](https://lumina-ai-eight-sigma.vercel.app/)**

## ✨ Key Features

* **Real-Time Database Syncing:** Prompts are processed by Gemini AI on a serverless backend and streamed instantly to the frontend using Firestore real-time listeners.
* **Human-in-the-Loop Workflow:** An interactive dashboard allows users to review, approve, or discard AI-generated drafts.
* **High-Fidelity UI/UX:** Built with Tailwind CSS and Framer Motion for seamless layout transitions, delivering a premium, market-ready user experience.
* **Serverless Architecture:** Fully deployed on Vercel using Next.js App Router API endpoints for secure, zero-cost backend processing.

## 🛠️ Tech Stack

* **Frontend:** Next.js, React.js, Tailwind CSS, Framer Motion, Lucide Icons
* **Backend:** Next.js Route Handlers (Serverless API)
* **Database:** Cloud Firestore (NoSQL, Real-time)
* **AI Engine:** Google Gemini via `@google/generative-ai`

## ⚙️ How the Architecture Works

1. **Input:** The user submits a prompt via the frontend dashboard.
2. **Serverless API Trigger:** The frontend hits an internal Next.js API route (`/api/generate`).
3. **AI Processing:** The server-side route securely constructs an agentic prompt and queries the Gemini API.
4. **Database Write:** The AI's generated response is successfully written to a Firestore collection.
5. **Real-time UI Update:** The Next.js frontend, actively listening via `onSnapshot`, instantly detects the new document and animates the new content onto the screen without a page refresh.

## 🏃‍♂️ Running Locally

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd frontend
npm install

### 2. Configure Environment Variables
Create a .env.local file in the frontend directory and add your Firebase and Gemini configuration securely:

Code snippet
# Gemini Configuration
GEMINI_API_KEY="your-gemini-key"

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

### 3. Start the Development Server
```bash
npm run dev
Designed and engineered to bridge the gap between intuitive UI/UX design and scalable full-stack development.
