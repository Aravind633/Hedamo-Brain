
import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import QueryProvider from "@/providers/query-provider";
import { SmoothScroll } from "@/components/ui/smooth-scroll"; // 1. Import SmoothScroll

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader" });

export const metadata: Metadata = {
  title: "Cortex | Intelligent Memory",
  description: "AI-Powered Knowledge Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${newsreader.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            {/* 2. Wrap content with SmoothScroll */}
            <SmoothScroll>
              {children}
            </SmoothScroll>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}