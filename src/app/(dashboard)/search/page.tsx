import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, FileText } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

// Define the Props type for Next.js 15+ (where params are Promises)
type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage(props: SearchPageProps) {
  // 1. Await the search parameters
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";
  
  // 2. Setup Supabase
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 3. Perform the Search (if a query exists)
  let notes: any[] = [];
  
  if (query) {
    const { data } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id) // Only show MY notes
      .ilike("content", `%${query}%`) // Simple text search (case insensitive)
      .order("created_at", { ascending: false });
      
    notes = data || [];
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-light tracking-tight text-neutral-900 dark:text-white">
          Search
        </h1>
      </div>

      {/* SEARCH BAR FORM */}
      {/* method="get" puts the input in the URL (?q=...) */}
      <GlassCard className="p-6">
        <form className="flex gap-2" method="get" action="/search">
          <Input 
            name="q" 
            placeholder="Search your notes..." 
            defaultValue={query}
            className="bg-white/50 dark:bg-black/50"
            autoFocus
          />
          <Button type="submit" size="icon">
            <SearchIcon size={18} />
          </Button>
        </form>
      </GlassCard>

      {/* RESULTS AREA */}
      <div className="space-y-4">
        {query && notes.length === 0 && (
          <p className="text-center text-neutral-500 mt-10">
            No notes found for "<span className="font-semibold">{query}</span>".
          </p>
        )}

        {notes.map((note) => (
          <Link key={note.id} href={`/notes/${note.id}`} className="block">
            <GlassCard className="p-6 transition-all hover:scale-[1.01] hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-white">
                    {note.title || "Untitled Note"}
                  </h3>
                  <p className="line-clamp-2 mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    {note.content}
                  </p>
                  <p className="mt-2 text-xs text-neutral-400">
                    {new Date(note.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}