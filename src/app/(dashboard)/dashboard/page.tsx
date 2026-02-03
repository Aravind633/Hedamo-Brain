
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/glass-card";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { formatDate } from "@/lib/utils";
import { 
  FileText, Lightbulb, Code, Link as LinkIcon, 
  Sparkles, Ghost, Brain, Activity, Zap, LogIn, Lock, Quote 
} from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";

// 1. Explicit Interface
interface Note {
  id: string;
  title: string;
  content: string;
  type: string;
  created_at: string;
}

function getTypeStyles(type: string) {
  switch (type) {
    case "idea": return { icon: <Lightbulb size={18} />, color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" };
    case "snippet": return { icon: <Code size={18} />, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" };
    case "article": return { icon: <LinkIcon size={18} />, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" };
    default: return { icon: <FileText size={18} />, color: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400" };
  }
}

function getKnowledgeQuote() {
  const quotes = [
    "Your mind is for having ideas, not holding them.",
    "Knowledge is the compound interest of curiosity.",
    "Organize your thoughts, and your life will follow.",
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ type?: string; sort?: string }> }) {
  const params = await searchParams;
  const filterType = params?.type || null;
  const sortOrder = params?.sort || "newest";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Guest View
    return (
      <FadeIn className="space-y-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="text-neutral-900 dark:text-white" />
            <span className="font-bold text-xl tracking-tight">Cortex</span>
          </div>
          <Link href="/login">
            <button className="flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition-transform hover:scale-105 dark:bg-white dark:text-black">
              <LogIn size={16} /> Sign In
            </button>
          </Link>
        </div>
        <div className="text-center py-10 space-y-6 max-w-2xl mx-auto">
          <h1 className="text-5xl font-light tracking-tight text-neutral-900 dark:text-white">
            Your External <span className="font-semibold">Neural Network</span>.
          </h1>
          <div className="flex justify-center gap-4 pt-4">
             <Link href="/login">
              <button className="rounded-full bg-blue-600 px-8 py-3 font-medium text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">Get Started</button>
             </Link>
          </div>
        </div>
      </FadeIn>
    );
  }

  // 2. User View - Fetch Data with Types
  let query = supabase.from("notes").select("id, title, content, type, created_at").eq("user_id", user.id);
  
  if (filterType && filterType !== "all") query = query.eq("type", filterType);
  if (sortOrder === "oldest") query = query.order("created_at", { ascending: true });
  else if (sortOrder === "az") query = query.order("title", { ascending: true });
  else query = query.order("created_at", { ascending: false });

  // Cast both queries
  const { data: notes } = await query as { data: Note[] | null };
  const { data: allNotes } = await supabase
    .from("notes")
    .select("type")
    .eq("user_id", user.id) as { data: Note[] | null };

  const stats = {
    total: allNotes?.length || 0,
    ideas: allNotes?.filter(n => n.type === "idea").length || 0,
    snippets: allNotes?.filter(n => n.type === "snippet").length || 0,
    articles: allNotes?.filter(n => n.type === "article").length || 0,
  };

  const randomNote = notes && notes.length > 0 ? notes[Math.floor(Math.random() * notes.length)] : null;
  const quote = getKnowledgeQuote();

  return (
    <FadeIn className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Brain size={16} className="text-neutral-900 dark:text-white"/>
            <span className="text-sm font-semibold uppercase tracking-wider text-neutral-500">System Online</span>
          </div>
          <h1 className="text-4xl font-light tracking-tight text-neutral-900 dark:text-white">Second Brain</h1>
          <p className="text-neutral-500 italic mt-2">"{quote}"</p>
        </div>
        <Link href="/notes/new">
          <button className="flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:scale-105 dark:bg-white dark:text-black">
            <Sparkles size={16} /> <span>New Signal</span> 
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", count: stats.total, icon: Activity, color: "text-blue-500" },
          { label: "Ideas", count: stats.ideas, icon: Lightbulb, color: "text-yellow-500" },
          { label: "Snippets", count: stats.snippets, icon: Code, color: "text-purple-500" },
          { label: "Links", count: stats.articles, icon: LinkIcon, color: "text-green-500" },
        ].map((stat) => (
          <GlassCard key={stat.label} className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stat.count}</p>
            </div>
            <div className={`p-2 rounded-full bg-neutral-50 dark:bg-neutral-800 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Memory Spark */}
      {randomNote && stats.total > 3 && (
        <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-6 dark:border-orange-900/30 dark:bg-orange-900/10">
          <div className="flex items-center gap-2 mb-2 text-orange-600 dark:text-orange-400">
            <Zap size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Spark: Rediscover this</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white">{randomNote.title}</h3>
              <p className="line-clamp-1 text-sm text-neutral-500">{randomNote.content}</p>
            </div>
            <Link href={`/notes/${randomNote.id}`}>
              <button className="text-xs font-medium text-orange-600 underline decoration-2 underline-offset-2 hover:text-orange-700">View</button>
            </Link>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="space-y-6">
        <DashboardFilters />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notes?.map((note) => {
            const style = getTypeStyles(note.type);
            return (
              <Link key={note.id} href={`/notes/${note.id}`} className="block h-full">
                <GlassCard className="group relative flex h-full flex-col justify-between p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-neutral-900/50">
                  <div className="mb-4 flex items-start justify-between">
                    <div className={`rounded-full p-2 ${style.color}`}>{style.icon}</div>
                    <span className="text-[10px] uppercase font-medium text-neutral-400">{formatDate(note.created_at)}</span>
                  </div>
                  <div className="mb-6 flex-grow">
                    <h3 className="mb-2 text-lg font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors dark:text-white">{note.title}</h3>
                    <p className="line-clamp-3 text-sm text-neutral-500 dark:text-neutral-400">{note.content}</p>
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </div>
    </FadeIn>
  );
}