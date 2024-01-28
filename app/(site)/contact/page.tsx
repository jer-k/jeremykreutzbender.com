/**
 * v0 by Vercel.
 * @see https://v0.dev/t/vNBBWWdOW8w
 */
import Image from "next/image";
import Link from "next/link";

import { ContactForm } from "@/components/contact-form";

import { Button } from "@/components/ui/button";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Me",
  description: "Contact Me",
};

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-20">
            <div className="space-y-8 lg:pr-8">
              <Image
                priority
                alt="Contact Image"
                className="aspect-content rounded-lg object-cover object-center"
                height="400"
                src="/me/sunset-headshot.png"
                width="400"
              />
              <p>
                Feel free to reach out if you have a comment or question about
                something I&apos;ve written or recorded, or if you just want to
                connect.
              </p>
              <p>You can also find me on various social sites, linked below.</p>
            </div>
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
          <div className="flex space-x-4">
            <Link href="https://twitter.com/J_Kreutzbender">
              <Button variant="link">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
                <span className="sr-only">Twitter</span>
              </Button>
            </Link>
            <Link href="https://www.linkedin.com/in/jeremykreutzbender/">
              <Button variant="link">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect height="12" width="4" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                <span className="sr-only">LinkedIn</span>
              </Button>
            </Link>
            <Link href="https://github.com/jer-k">
              <Button variant="link">
                <svg
                  className=" h-6 w-6"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <span className="sr-only">GitHub</span>
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
