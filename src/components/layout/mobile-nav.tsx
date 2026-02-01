"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // You might need to install shadcn sheet or use a simple dialog
import { Menu, Brain } from "lucide-react";
import { Sidebar } from "./sidebar"; // Reuse your existing sidebar content
import { useState } from "react";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="md:hidden p-2 text-neutral-500 hover:bg-neutral-100 rounded-md dark:text-neutral-400 dark:hover:bg-neutral-800">
          <Menu size={24} />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800">
        {/* We reuse the Sidebar but strip the "hidden" class via the wrapper */}
        <div className="h-full">
           <Sidebar /> 
        </div>
      </SheetContent>
    </Sheet>
  );
}