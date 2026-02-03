"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
// ✅ FIX: Import type directly from "next-themes", NOT "next-themes/dist/types"
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}