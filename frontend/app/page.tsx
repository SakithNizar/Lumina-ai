"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, MessageSquare, Clock, Check, Trash2, Send, Loader2 } from "lucide-react";

interface SocialPost {
  id: string;
  rawInput: string;
  generatedText: string;
  status: string;
  timestamp: any;
}

export default function Dashboard() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- NEW: State for the input form ---
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "socialPosts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as SocialPost[];
      
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- NEW: Trigger Backend from UI ---
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      // REPLACE THIS URL with your live Firebase Function URL, or use http://127.0.0.1:5001/... for local testing
      const webhookUrl = "YOUR_CLOUD_FUNCTION_URL_HERE"; 
      
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: prompt }),
      });
      
      setPrompt(""); // Clear the input field after sending
    } catch (error) {
      console.error("Error generating post:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const postRef = doc(db, "socialPosts", id);
      await updateDoc(postRef, { status: "Approved" });
    } catch (error) {
      console.error("Error approving post:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const postRef = doc(db, "socialPosts", id);
      await deleteDoc(postRef);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-8 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-5xl mx-auto">
        
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-blue-500" />
              Lumina AI
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Real-time social media generation engine.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-slate-600">System Live</span>
          </div>
        </motion.header>

        {/* --- NEW: Interactive Input Form --- */}
        <motion.form 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleGenerate} 
          className="mb-12 bg-white p-2 pl-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type a prompt to generate a new post... (e.g., 'launching a new feature')"
            className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 py-4"
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white transition-all ${
              !prompt.trim() || isGenerating 
                ? "bg-slate-300 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-md active:scale-95"
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Generate
              </>
            )}
          </button>
        </motion.form>

        {loading ? (
          <div className="flex justify-center py-32">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <Clock className="w-8 h-8 text-slate-300" />
            </motion.div>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.div 
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                  className="bg-white p-7 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                        post.status === "Approved" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {post.status || "Draft Review"}
                      </span>
                    </div>
                    
                    <div className="mb-6">
                      <p className="text-slate-800 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                        {post.generatedText}
                      </p>
                    </div>

                    <div className="pt-4 pb-6 flex items-start gap-3">
                      <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Raw Input Prompt</h3>
                        <p className="text-sm text-slate-600 italic">"{post.rawInput}"</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => handleApprove(post.id)}
                      disabled={post.status === "Approved"}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition-all ${
                        post.status === "Approved" 
                        ? "bg-slate-50 text-slate-400 cursor-not-allowed" 
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-sm"
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      {post.status === "Approved" ? "Approved" : "Approve Draft"}
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="px-4 py-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 hover:text-red-600 transition-colors flex items-center justify-center"
                      title="Delete Draft"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {posts.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="col-span-full flex flex-col items-center justify-center p-20 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-slate-600 font-semibold text-lg">Awaiting Instructions</p>
                <p className="text-slate-400 mt-2 text-center max-w-sm">Type a prompt above to generate your first AI post.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}
