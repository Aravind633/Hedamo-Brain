"use client";

import { useState } from "react";
import { askBrain } from "@/features/brain/actions"; // We will create this next
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Brain, Send, Sparkles, Bot } from "lucide-react";

export default function AskPage() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setAnswer("");
    
    // Call Server Action
    const response = await askBrain(query);
    
    setAnswer(response);
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-black shadow-xl">
          <Brain size={32} />
        </div>
        <h1 className="text-3xl font-light tracking-tight text-neutral-900 dark:text-white">
          Ask Cortex
        </h1>
        <p className="text-neutral-500">
          Query your second brain using natural language.
        </p>
      </div>

      {/* Input Area */}
      <GlassCard className="p-2">
        <form onSubmit={handleAsk} className="flex gap-2">
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: What was that idea about AI architecture?" 
            className="border-none shadow-none bg-transparent focus-visible:ring-0 text-lg"
            autoFocus
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={loading}
            className="rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black"
          >
            {loading ? <Sparkles className="animate-spin" size={18} /> : <Send size={18} />}
          </Button>
        </form>
      </GlassCard>

      {/* Answer Area */}
      {answer && (
        <div className="flex gap-4 animate-in slide-in-from-bottom-4 duration-500">
          <div className="shrink-0 mt-1">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Bot size={18} />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Cortex Answer:</h3>
            <GlassCard className="p-6 bg-white/80 dark:bg-neutral-900/80">
              <p className="leading-relaxed text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                {answer}
              </p>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}