import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
  return (
    <header>
      <div className="hidden h-full flex-row md:flex">
        <div className="container px-0 flex flex-row items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0 md:h-20">
          <div className="flex flex-row items-start space-y-2 space-x-4">
            <Link href="/">
              <div className="flex flex-row items-center space-x-2">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/jer-k.png"
                    alt="@jer-k"
                  />
                  <AvatarFallback>JK</AvatarFallback>
                </Avatar>
                <h2>jeremykreutzbender.com</h2>
              </div>
            </Link>
            <Link href="/blog">Blog</Link>
            <Link href="/videos">Videos</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className="flex flex-row items-start justify-end space-y-2 space-x-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
            <ModeToggle />
          </div>
        </div>
        <div className="md:hidden flex items-center">
          <button className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400">
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path
                clipRule="evenodd"
                d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z"
                fillRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
