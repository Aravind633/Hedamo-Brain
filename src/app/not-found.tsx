import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4">
      <h2 className="text-4xl font-serif font-bold">404</h2>
      <p className="text-neutral-500">This thought has not been captured yet.</p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  )
}