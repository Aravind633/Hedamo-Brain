import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Memex",
  description: "Sign in to your second brain",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
      {children}
    </div>
  );
}