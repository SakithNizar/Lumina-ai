"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";

// Define the shape of the data coming from Firestore
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
    // Query the database to pull the latest posts first
    const q = query(collection(db, "socialPosts"), orderBy("timestamp", "desc"));

    // Set up a real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as SocialPost[];
      
      setPosts(postsData);
      setLoading(false);
    });

    // Cleanup listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Agent AI Dashboard</h1>
          <p className="text-gray-500 mt-2">Live stream of generated social media posts.</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-pulse text-gray-400 font-medium tracking-wide">Loading Agent Data...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full uppercase tracking-wide">
                    {post.status || "Published"}
                  </span>
                </div>
                
                <div className="mb-5">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">AI Generated Copy</h3>
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{post.generatedText}</p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Raw Input Prompt</h3>
                  <p className="text-sm text-gray-500 italic">"{post.rawInput}"</p>
                </div>
              </div>
            ))}
            
            {posts.length === 0 && (
              <div className="col-span-full text-center p-16 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 font-medium">No posts generated yet.</p>
                <p className="text-sm text-gray-400 mt-1">Trigger your webhook to see the AI flow in real-time.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
