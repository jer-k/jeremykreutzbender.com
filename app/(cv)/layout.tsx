"use client";

import { Info, MoveLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "@/lib/theme-provider";

export default function CvLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const previousThemeRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (previousThemeRef.current === undefined) {
      previousThemeRef.current = theme;
    }
    setTheme("light");

    return () => {
      if (previousThemeRef.current && previousThemeRef.current !== "light") {
        setTheme(previousThemeRef.current);
      }
    };
  }, [theme, setTheme]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="print:hidden">
        <div className="mx-auto h-full w-full max-w-240 px-5 py-2">
          <div className="flex w-full flex-row items-center justify-between">
            <Button
              aria-label="Back"
              onClick={() => router.back()}
              size="icon"
              variant="ghost"
            >
              <MoveLeft />
            </Button>
            <Popover>
              <PopoverTrigger
                nativeButton={false}
                render={<Info className="cursor-pointer" />}
              />
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
      <div className="mx-auto flex w-full max-w-240 flex-1 flex-col px-5 pt-4 print:px-0 print:pt-0">
        {children}
      </div>
    </div>
  );
}
