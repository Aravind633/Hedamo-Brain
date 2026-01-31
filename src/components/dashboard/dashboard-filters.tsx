"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

export function DashboardFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current values from URL or default to empty
  const currentType = searchParams.get("type") || "all";
  const currentSort = searchParams.get("sort") || "newest";

  // Helper to update URL
  function updateFilters(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
      {/* Type Filters (Tabs style) */}
      <div className="flex flex-wrap gap-2">
        {["all", "note", "article", "snippet", "idea"].map((type) => (
          <Button
            key={type}
            variant={currentType === type ? "default" : "outline"}
            size="sm"
            onClick={() => updateFilters("type", type)}
            className="capitalize"
          >
            {type}
          </Button>
        ))}
      </div>

      {/* Sort Dropdown */}
      <div className="w-[180px]">
        <Select 
          value={currentSort} 
          onValueChange={(val) => updateFilters("sort", val)}
        >
          <SelectTrigger className="bg-white dark:bg-neutral-900">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="az">Title (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}