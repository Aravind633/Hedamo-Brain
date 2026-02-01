
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createNote } from "@/features/notes/actions";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NewNotePage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link 
          href="/"
          className="rounded-full bg-neutral-100 p-2 text-neutral-500 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          New Knowledge Item
        </h1>
      </div>

      {/* The Form */}
      <form action={createNote} className="space-y-6">
        
        {/* ROW 1: Title & Type */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <Input 
              name="title" 
              placeholder="Title (required)" 
              required 
              className="bg-white dark:bg-neutral-900"
            />
          </div>
          
          <Select name="type" defaultValue="note">
            <SelectTrigger className="bg-white dark:bg-neutral-900">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="note">Note</SelectItem>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="snippet">Code Snippet</SelectItem>
              <SelectItem value="idea">Idea</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ROW 2: Source URL (Optional) */}
        <div>
          <Input 
            name="source_url" 
            placeholder="Source URL (optional)" 
            type="url"
            className="bg-white dark:bg-neutral-900"
          />
        </div>

        {/* ROW 3: Content */}
        <div className="relative">
          <Textarea 
            name="content"
            placeholder="Write your thoughts here..." 
            className="min-h-[300px] resize-none bg-white p-6 text-lg leading-relaxed shadow-sm dark:bg-neutral-900"
            required
          />
          {/* AI Badge */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
            <Sparkles size={12} />
            <span>AI Auto-Tagging</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button size="lg" type="submit">
            Save to Brain
          </Button>
        </div>
      </form>
    </div>
  );
}