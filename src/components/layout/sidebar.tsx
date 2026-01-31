
// "use client";

// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// // 1. Add 'Brain' to imports
// import { LayoutGrid, Search, Plus, Settings, LogOut, Brain } from "lucide-react"; 
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { createClient } from "@/lib/supabase/client";
// import { useRouter } from "next/navigation";

// export function Sidebar() {
//   const pathname = usePathname();
//   const router = useRouter();

//   async function handleSignOut() {
//     const supabase = createClient();
//     await supabase.auth.signOut();
//     router.push("/login");
//   }

//   const links = [
//     { href: "/", label: "Dashboard", icon: LayoutGrid },
//     { href: "/search", label: "Search", icon: Search },
//     { href: "/notes/new", label: "New Note", icon: Plus },
//   ];

//   return (
//     <div className="flex h-screen w-64 flex-col border-r border-neutral-200 bg-white px-4 py-6 dark:border-neutral-800 dark:bg-neutral-950">
      
//       {/* 2. UPDATED LOGO SECTION */}
//       <div className="mb-8 flex items-center gap-3 px-2">
//         <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black">
//           <Brain size={18} />
//         </div>
//         <span className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
//           Cortex
//         </span>
//       </div>

//       {/* Navigation Links */}
//       <nav className="flex-1 space-y-1">
//         {links.map((link) => {
//           const Icon = link.icon;
//           const isActive = pathname === link.href;

//           return (
//             <Link
//               key={link.href}
//               href={link.href}
//               className={cn(
//                 "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
//                 isActive
//                   ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
//                   : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
//               )}
//             >
//               <Icon size={18} />
//               {link.label}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Bottom Actions */}
//       <div className="border-t border-neutral-200 pt-4 dark:border-neutral-800">
//         <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white">
//           <Settings size={18} />
//           Settings
//         </button>
//         <button 
//           onClick={handleSignOut}
//           className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
//         >
//           <LogOut size={18} />
//           Log out
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// 1. Updated Import: Added 'Sparkles'
import { LayoutGrid, Search, Plus, Settings, LogOut, Brain, Sparkles } from "lucide-react"; 
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  // 2. Updated Links Array
  const links = [
    { href: "/", label: "Dashboard", icon: LayoutGrid },
    { href: "/search", label: "Search", icon: Search },
    { href: "/ask", label: "Ask Cortex", icon: Sparkles }, // ✨ New AI Feature
    { href: "/notes/new", label: "New Note", icon: Plus },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r border-neutral-200 bg-white px-4 py-6 dark:border-neutral-800 dark:bg-neutral-950">
      
      {/* Logo Section */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black">
          <Brain size={18} />
        </div>
        <span className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
          Cortex
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
              )}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-neutral-200 pt-4 dark:border-neutral-800">
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white">
          <Settings size={18} />
          Settings
        </button>
        <button 
          onClick={handleSignOut}
          className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </div>
  );
}