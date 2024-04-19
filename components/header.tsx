import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { GithubIconButton } from "@/components/github-icon-button";
import { LinkedInIconButton } from "@/components/linkedin-icon-button";
import { TwitterIconButton } from "@/components/twitter-icon-button";
import { HighlightLink } from "@/components/highlight-link";

export function Header() {
  return (
    <header className="mb-4 border-b border-primary dark:border-bright">
      <div className="hidden md:flex h-full flex-row px-16">
        <div className="container px-0 flex flex-row items-center justify-between">
          <HighlightLink label="Home" href="/" />
          <div className="flex flex-row items-center space-x-4">
            <HighlightLink label="Blog" href="/blog" />
            <HighlightLink label="CV" href="/cv" />
            <HighlightLink label="Open Source" href="/open_source" />
            <HighlightLink label="Contact" href="/contact" />
            {/*<HighlightLink label="About" href="/about" />*/}
            <div className="flex flex-row items-center space-x-2">
              <GithubIconButton
                href={"https://github.com/jer-k/jeremykreutzbender.com"}
              />
              <TwitterIconButton href={"https://twitter.com/J_Kreutzbender"} />
              <LinkedInIconButton
                href={"https://www.linkedin.com/in/jeremykreutzbender/"}
              />
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden flex px-16">
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
              <Link aria-label="Contact" href="/cv">
                CV
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link aria-label="Open Source" href="/open_source">
                Open Source
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link aria-label="Contact" href="/contact">
                Contact
              </Link>
            </DropdownMenuItem>
            {/*<DropdownMenuItem asChild>
              <Link aria-label="About" href="/about">
                About
              </Link>
            </DropdownMenuItem>*/}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
