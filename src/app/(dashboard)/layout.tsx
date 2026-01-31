import { Sidebar } from "@/components/layout/sidebar"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Sidebar userEmail={user.email} />
      <main className="flex-1 pl-64 transition-all duration-300 ease-in-out">
        <div className="container mx-auto max-w-5xl p-8">
            {children}
        </div>
      </main>
    </div>
  )
}