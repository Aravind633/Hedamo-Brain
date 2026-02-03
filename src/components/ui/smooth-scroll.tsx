
"use client";

import { ReactLenis } from "@studio-freight/react-lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      {/* Cast children to any to bypass the React 19 vs 18 version mismatch error */}
      {children as any}
    </ReactLenis>
  );
}