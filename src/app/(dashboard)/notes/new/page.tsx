// "use client"

// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea"; // Ensure you created this in Phase 2
// import { createNote } from "@/features/notes/actions";
// import { ArrowLeft, Sparkles } from "lucide-react";
// import Link from "next/link";
// import { useFormStatus } from "react-dom";

// export default function NewNotePage() {
//   return (
//     <div className="max-w-2xl mx-auto">
//       <div className="mb-6 flex items-center gap-4">
//         <Link href="/">
//             <Button variant="ghost" size="icon">
//                 <ArrowLeft size={18} />
//             </Button>
//         </Link>
//         <h1 className="text-2xl font-serif font-semibold">New Thought</h1>
//       </div>

//       <form action={createNote} className="space-y-4">
//         <div className="relative">
//             <Textarea 
//                 name="content"
//                 placeholder="What's on your mind? (AI will generate the title and tags for you...)"
//                 className="min-h-[400px] resize-none border-none bg-transparent p-0 text-lg leading-relaxed focus-visible:ring-0"
//                 autoFocus
//             />
//         </div>
        
//         <div className="flex justify-end">
//             <SubmitButton />
//         </div>
//       </form>
//     </div>
//   );
// }

// // A tiny sub-component to handle the "Loading" state of the button
// function SubmitButton() {
//     const { pending } = useFormStatus();
    
//     return (
//         <Button disabled={pending} type="submit" className="gap-2">
//             {pending ? (
//                 "Processing..."
//             ) : (
//                 <>
//                     <Sparkles size={16} />
//                     Save & Analyze
//                 </>
//             )}
//         </Button>
//     )
// }



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