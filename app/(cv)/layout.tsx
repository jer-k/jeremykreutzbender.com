import type { ReactNode } from "react";

import { Info, MoveLeft } from "lucide-react";
import Link from "next/link";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function CvLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white">
      <header className="print:hidden">
        <div className="h-full flex-row px-16 py-2">
          <div className="px-0 flex flex-row items-center justify-between w-full">
            <Link aria-label="Home" className="cursor-pointer" href="/">
              <MoveLeft />
            </Link>
            <Popover>
              <PopoverTrigger asChild>
                <Info className="cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent className="bg-white w-80 mr-4">
                <p>
                  This is my interactive CV, which encompasses everything
                  related to my education and professional career. There are
                  links throughout the page to different technologies and to
                  projects I&apos;ve worked on.
                </p>
                <p className="mt-2">
                  This CV is also printer friendly and can be used as a resume,
                  however I do maintain a single page resume that you can
                  request via the{" "}
                  {
                    <Link
                      aria-label="Contact"
                      href="/contact"
                      className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    >
                      Contact
                    </Link>
                  }{" "}
                  page.
                </p>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
