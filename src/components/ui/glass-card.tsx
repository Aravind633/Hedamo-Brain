import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  gradient?: boolean
}

export function GlassCard({ children, className, gradient = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-neutral-200/60 bg-white/40 p-6 backdrop-blur-xl transition-all hover:border-neutral-300/80 dark:border-neutral-800/60 dark:bg-neutral-900/40",
        gradient && "bg-gradient-to-br from-white/60 to-white/30 dark:from-neutral-900/60 dark:to-neutral-900/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}