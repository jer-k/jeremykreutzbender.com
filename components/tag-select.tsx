"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

export function TagSelect({ tags }: { tags: string[] }) {
	const [open, setOpen] = React.useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();

	const selectedTags = searchParams.get("tags")?.split(",") || [];

	const toggleTag = (tag: string) => {
		const newTags = selectedTags.includes(tag)
			? selectedTags.filter((t) => t !== tag)
			: [...selectedTags, tag];
		updateUrl(newTags);
	};

	const clearTags = () => {
		updateUrl([]);
	};

	const updateUrl = (newTags: string[]) => {
		const params = new URLSearchParams(searchParams);
		if (newTags.length > 0) {
			params.set("tags", newTags.join(","));
		} else {
			params.delete("tags");
		}
		params.delete("page"); // Reset pagination when changing tags
		router.push(`/blog?${params.toString()}`);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between h-auto min-h-[2.5rem] py-2"
				>
					{selectedTags.length > 0 ? (
						<>
							<div className="flex flex-wrap gap-1 max-h-[4.5rem] overflow-y-auto pr-2 w-full">
								{selectedTags.map((tag) => (
									<Badge key={tag} variant="secondary" className="text-xs">
										{tag}
									</Badge>
								))}
							</div>
						</>
					) : (
						<span className="text-muted-foreground">Filter Posts</span>
					)}
					{selectedTags.length > 0 ? (
						<Button
							className="p-0"
							variant="ghost"
							size="sm"
							onClick={clearTags}
						>
							<X className="h-4 w-4 shrink-0 opacity-50" />
						</Button>
					) : (
						<Search className="h-4 w-4 shrink-0 opacity-50" />
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command>
					<CommandInput placeholder="Search tags..." />
					<CommandGroup className="p-2">
						<div className="grid grid-cols-3 gap-2 max-h-96 overflow-scroll">
							{tags.map((tag) => (
								<CommandItem
									key={tag}
									onSelect={() => toggleTag(tag)}
									className="col-span-1 justify-start px-2 py-1"
								>
									<Check
										className={cn(
											"mr-1 h-3 w-3",
											selectedTags.includes(tag) ? "opacity-100" : "opacity-0",
										)}
									/>
									<span className="truncate">{tag}</span>
								</CommandItem>
							))}
						</div>
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
