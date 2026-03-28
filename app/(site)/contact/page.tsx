import type { Metadata } from "next";
import Image from "next/image";

import { ContactForm } from "@/components/contact-form";
import { GithubIconButton } from "@/components/github-icon-button";
import { LinkedInIconButton } from "@/components/linkedin-icon-button";
import { TwitterIconButton } from "@/components/twitter-icon-button";

import sunsetPic from "@/public/me/sunset-headshot.png";

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
        alt: "Jeremy Kreutzbender's Contact page",
        type: "image/png",
      },
    ],
  },
};

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto w-full py-8 px-4">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        <div className="flex flex-col items-center md:items-start gap-4 md:w-1/3">
          <Image
            priority
            alt="Contact Image"
            className="rounded-lg object-cover w-48 h-48 md:w-full md:h-auto md:aspect-square"
            src={sunsetPic}
            width={400}
            height={400}
            placeholder="blur"
          />
          <p className="text-center md:text-left">
            Feel free to reach out if you have a comment or question about
            something I&apos;ve written or recorded, or if you just want to
            connect.
          </p>
          <p className="text-center md:text-left">
            You can also find me on various social sites, linked below.
          </p>
          <div className="flex gap-2">
            <TwitterIconButton href="https://twitter.com/J_Kreutzbender" />
            <LinkedInIconButton href="https://www.linkedin.com/in/jeremykreutzbender/" />
            <GithubIconButton href="https://github.com/jer-k" />
          </div>
        </div>
        <div className="md:w-2/3">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
