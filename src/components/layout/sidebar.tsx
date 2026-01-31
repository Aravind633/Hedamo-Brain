"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutGrid, Plus, Search, Settings, LogOut, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface SidebarProps {
  userEmail?: string | null
}

export function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-neutral-200/50 bg-white/50 backdrop-blur-xl dark:border-white/10 dark:bg-black/50">
      <div className="flex h-full flex-col p-4">
        
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black">
            <LayoutGrid size={18} />
          </div>
          <span className="font-serif text-lg font-medium tracking-tight">Memex</span>
        </div>

        {/* Action */}
        <Link href="/notes/new">
            <Button className="mb-6 w-full justify-start gap-2 shadow-sm" size="lg">
            <Plus size={18} />
            <span>New Note</span>
            </Button>
        </Link>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          <NavItem 
            href="/" 
            icon={<LayoutGrid size={18} />} 
            label="All Notes" 
            active={pathname === "/"} 
          />
          <NavItem 
            href="/search" 
            icon={<Search size={18} />} 
            label="Search" 
            active={pathname === "/search"} 
          />
           {/* Add more links here if needed */}
        </nav>

        {/* User Footer */}
        <div className="mt-auto pt-4 border-t border-neutral-200/50 dark:border-white/10">
            {userEmail ? (
                <div className="px-2">
                     <div className="mb-2 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500" />
                        <div className="flex-1 overflow-hidden">
                            <p className="truncate text-sm font-medium">{userEmail}</p>
                            <p className="text-xs text-neutral-500">Pro Plan</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start gap-2 text-neutral-500">
                        <LogOut size={16} />
                        Log out
                    </Button>
                </div>
            ) : (
                 <Link href="/login">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                        Log In
                    </Button>
                </Link>
            )}
        </div>
      </div>
    </aside>
  )
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className={cn(
            "w-full justify-start gap-3",
            active ? "bg-neutral-200/50 font-medium dark:bg-white/10" : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        )}
      >
        {icon}
        {label}
      </Button>
    </Link>
  )
}