"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, MessageSquare, Clock } from "lucide-react";

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

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-8 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Animated Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-blue-500" />
              Pulse AI
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Real-time social media generation engine.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-slate-600">System Live</span>
          </div>
        </motion.header>

        {loading ? (
          <div className="flex justify-center py-32">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Clock className="w-8 h-8 text-slate-300" />
            </motion.div>
          </div>
        ) : (
          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.div 
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                  className="bg-white p-7 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow group"
                >
                  <div className="flex justify-between items-center mb-6">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {post.status || "Published"}
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-slate-800 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                      {post.generatedText}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-slate-100 flex items-start gap-3 bg-slate-50 p-4 rounded-xl">
                    <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Raw Input Prompt</h3>
                      <p className="text-sm text-slate-600 italic">"{post.rawInput}"</p>
                    </div>
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
                <p className="text-slate-400 mt-2 text-center max-w-sm">Fire your webhook to see the AI agent generate and animate new posts into the feed.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}
