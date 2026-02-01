// import { Sidebar } from "@/components/layout/sidebar"
// import { createClient } from "@/lib/supabase/server"
// import { redirect } from "next/navigation"

// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth.getUser()

//   if (!user) {
//     redirect("/login")
//   }

//   return (
//     <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
//       <Sidebar userEmail={user.email} />
//       <main className="flex-1 pl-64 transition-all duration-300 ease-in-out">
//         <div className="container mx-auto max-w-5xl p-8">
//             {children}
//         </div>
//       </main>
//     </div>
//   )
// }

import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-50/50 dark:bg-black font-sans antialiased">
      {/* Desktop Sidebar */}
      <div className="hidden h-screen w-64 flex-col fixed inset-y-0 z-50 border-r border-neutral-200 bg-white/50 backdrop-blur-xl md:flex dark:border-neutral-800 dark:bg-neutral-900/50">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 md:pl-64">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/50 backdrop-blur-md sticky top-0 z-40">
           <span className="font-semibold text-neutral-900 dark:text-white">Cortex</span>
           <MobileNav />
        </div>
        
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}