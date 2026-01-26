"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TagSelect({ tags }: { tags: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedTags = searchParams.get("tags")?.split(",").filter(Boolean) || [];

  const updateUrl = (newTags: string[]) => {
    const params = new URLSearchParams(searchParams);
    if (newTags.length > 0) {
      params.set("tags", newTags.join(","));
    } else {
      params.delete("tags");
    }
    params.delete("page");
    router.push(`/blog?${params.toString()}`);
  };

  const clearTags = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateUrl([]);
  };

  return (
    <ComboboxPrimitive.Root
      multiple
      value={selectedTags}
      onValueChange={updateUrl}
      items={tags}
    >
      <ComboboxPrimitive.Trigger
        render={
          <Button
            variant="outline"
            className="w-full justify-between h-auto min-h-10 py-2"
          >
            {selectedTags.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-1 max-h-18 overflow-y-auto pr-2 w-full">
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <span
                  role="button"
                  tabIndex={0}
                  className="p-1 hover:bg-muted rounded"
                  onClick={clearTags}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      clearTags(e as unknown as React.MouseEvent);
                    }
                  }}
                >
                  <X className="h-4 w-4 shrink-0 opacity-50" />
                </span>
              </>
            ) : (
              <>
                <span className="text-muted-foreground">Filter Posts</span>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
              </>
            )}
          </Button>
        }
      />

      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Positioner
          className="isolate z-50 outline-none w-(--anchor-width)"
          sideOffset={4}
          align="start"
        >
          <ComboboxPrimitive.Popup
            className={cn(
              "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95",
              "ring-foreground/10 bg-popover text-popover-foreground",
              "w-full rounded-lg p-2 shadow-md ring-1 duration-100",
              "origin-(--transform-origin) overflow-hidden outline-none"
            )}
          >
            <div className="flex items-center gap-2 px-2 pb-2 border-b border-border">
              <Search className="h-4 w-4 shrink-0 opacity-50" />
              <ComboboxPrimitive.Input
                placeholder="Search tags..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            <ComboboxPrimitive.List className="max-h-72 overflow-y-auto pt-2 grid grid-cols-3 gap-1">
              {(tag: string) => (
                <ComboboxPrimitive.Item
                  key={tag}
                  value={tag}
                  className={cn(
                    "col-span-1 flex items-center gap-1.5 px-2 py-1.5 text-sm rounded-md cursor-pointer outline-none",
                    "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
                    "data-selected:font-medium"
                  )}
                >
                  <ComboboxPrimitive.ItemIndicator
                    render={<Check className="h-3 w-3" />}
                    keepMounted
                    className="opacity-0 data-selected:opacity-100"
                  />
                  <span className="truncate">{tag}</span>
                </ComboboxPrimitive.Item>
              )}
            </ComboboxPrimitive.List>
            <ComboboxPrimitive.Empty className="py-4 text-center text-sm text-muted-foreground">
              No tags found.
            </ComboboxPrimitive.Empty>
          </ComboboxPrimitive.Popup>
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    </ComboboxPrimitive.Root>
  );
}
