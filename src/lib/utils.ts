

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// This function handles your Tailwind class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ADD THIS FUNCTION:
export function formatDate(dateString: string | number | Date) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}