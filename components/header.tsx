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
      </div>
    </header>
  );
}
