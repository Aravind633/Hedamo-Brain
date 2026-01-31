"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { Input } from "@/components/ui/input"
import { LayoutGrid, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [isSent, setIsSent] = useState(false)
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Using Magic Link (No Password) - Easiest for assignment
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Redirect back to this specific URL after clicking email link
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      alert("Error: " + error.message)
      setIsLoading(false)
    } else {
      setIsSent(true)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
      <GlassCard className="w-full max-w-md p-8 text-center" gradient>
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-xl dark:bg-white dark:text-black">
          <LayoutGrid size={24} />
        </div>

        <h1 className="mb-2 text-2xl font-semibold tracking-tight">
          Welcome to Memex
        </h1>
        <p className="mb-8 text-sm text-neutral-500">
          Sign in to access your knowledge graph.
        </p>

        {isSent ? (
            <div className="rounded-lg bg-green-50 p-4 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <p>Check your email!</p>
                <p className="text-xs">We sent a magic link to <strong>{email}</strong></p>
            </div>
        ) : (
            <form onSubmit={handleLogin} className="space-y-4">
                <Input 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Button 
                    className="w-full" 
                    size="lg" 
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Sign in with Email"}
                </Button>
            </form>
        )}
      </GlassCard>
    </div>
  )
}