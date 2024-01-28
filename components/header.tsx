"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  HomeIcon,
  VideoIcon,
  BookOpen,
  Contact,
  Sun,
  Moon,
} from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as React from "react";

export function Header() {
  const pathname = usePathname();

  const baseIcon = "h-7 w-7";
  const activeIcon = `${baseIcon} stroke-shine`;

  return (
    <header className="mb-4">
      <div className="hidden md:flex h-full flex-row">
        <div className="container px-0 flex flex-row items-center justify-between">
          <div className="flex flex-row items-end space-x-4">
            <Link aria-label="Home" href="/">
              <HomeIcon
                className={`link ${pathname === "/" ? activeIcon : baseIcon}`}
              />
            </Link>
            <Link aria-label="Blog" href="/blog">
              <BookOpen
                className={`link ${
                  pathname.includes("/blog") ? activeIcon : baseIcon
                }`}
              />
            </Link>
            <Link aria-label="Videos" href="/videos">
              <VideoIcon
                className={`link ${
                  pathname === "/videos" ? activeIcon : baseIcon
                }`}
              />
            </Link>
            <Link aria-label="Contact" href="/contact">
              <Contact
                className={`link ${
                  pathname === "/contact" ? activeIcon : baseIcon
                }`}
              />
            </Link>
          </div>
          <ModeToggle />
        </div>
      </div>
      <div className="md:hidden flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400">
              <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24">
                <path
                  clipRule="evenodd"
                  d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z"
                  fillRule="evenodd"
                />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link aria-label="Home" href="/">
                Home
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link aria-label="Blog" href="/blog">
                Blog
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link aria-label="Videos" href="/videos">
                Videos
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link aria-label="Contact" href="/contact">
                Contact
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link aria-label="Contact" href="/cv">
                CV
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
