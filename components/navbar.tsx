import Link from "next/link";

import { GithubIconButton } from "@/components/github-icon-button";
import { HighlightLink } from "@/components/highlight-link";
import { LinkedInIconButton } from "@/components/linkedin-icon-button";
import { ModeToggle } from "@/components/mode-toggle";
import { TwitterIconButton } from "@/components/twitter-icon-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { socialLinks } from "@/lib/constants/social-links";

export function Navbar() {
  return (
    <header>
      <div className="hidden md:flex h-full flex-row max-w-240 mx-auto w-full p-5">
        <div className="flex flex-row items-center justify-between w-full">
          <HighlightLink label="Home" href="/" />
          <div className="flex flex-row items-center gap-4">
            <HighlightLink label="Blog" href="/blog" />
            <HighlightLink label="CV" href="/cv" />
            <HighlightLink label="Open Source" href="/open_source" />
            <HighlightLink label="Contact" href="/contact" />
            <div className="flex flex-row items-center gap-2">
              <GithubIconButton href={socialLinks.github.repo} />
              <TwitterIconButton href={socialLinks.twitter} />
              <LinkedInIconButton href={socialLinks.linkedin} />
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden flex max-w-240 mx-auto w-full px-5">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-hidden focus:text-gray-600 dark:focus:text-gray-400">
                <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24">
                  <path
                    clipRule="evenodd"
                    d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z"
                    fillRule="evenodd"
                  />
                </svg>
              </button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              render={
                <Link aria-label="Home" href="/">
                  Home
                </Link>
              }
            />
            <DropdownMenuItem
              render={
                <Link aria-label="Blog" href="/blog">
                  Blog
                </Link>
              }
            />
            <DropdownMenuItem
              render={
                <Link aria-label="Contact" href="/cv">
                  CV
                </Link>
              }
            />
            <DropdownMenuItem
              render={
                <Link aria-label="Open Source" href="/open_source">
                  Open Source
                </Link>
              }
            />
            <DropdownMenuItem
              render={
                <Link aria-label="Contact" href="/contact">
                  Contact
                </Link>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
