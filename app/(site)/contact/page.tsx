import type { Metadata } from "next";
import Image from "next/image";

import { ContactForm } from "@/components/contact-form";
import { GithubIconButton } from "@/components/github-icon-button";
import { LinkedInIconButton } from "@/components/linkedin-icon-button";
import { TwitterIconButton } from "@/components/twitter-icon-button";

export const metadata: Metadata = {
  title: "Contact Me",
  description: "Contact Me",
  alternates: {
    canonical: "https://jeremykreutzbender.com/contact",
  },
  openGraph: {
    title: "Contact - Jeremy Kreutzbender",
    description: "Contact Me",
    url: "https://jeremykreutzbender.com/contact",
    siteName: "Jeremy Kreutzbender's personal site",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/api/og?title=Contact",
        width: 960,
        height: 540,
        alt: "Contact page",
        type: "image/png",
      },
    ],
  },
};

export default function Contact() {
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
                placeholder="blur"
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
            <TwitterIconButton href={"https://twitter.com/J_Kreutzbender"} />
            <LinkedInIconButton
              href={"https://www.linkedin.com/in/jeremykreutzbender/"}
            />
            <GithubIconButton href={"https://github.com/jer-k"} />
          </div>
        </div>
      </main>
    </div>
  );
}
