import Image from "next/image";

import { cvData } from "@/lib/constants/cv-data";

export function HomePageHero() {
  const { personalInfo } = cvData;
  return (
    <div className="flex flex-col md:flex-row items-start max-w-240 mx-auto w-full px-5 pt-10 pb-4 gap-8 md:gap-16">
      <Image
        priority
        alt="Hero Image"
        className="aspect-content rounded-lg object-cover object-center size-40 md:size-62.5"
        src={personalInfo.avatarUrl}
        width="250"
        height="250"
      />
      <div className="flex flex-col gap-2 md:text-left">
        <h1 className="font-bold text-3xl">Jeremy Kreutzbender</h1>
        <h3 className="font-semibold text-xl">Product Engineer</h3>
        <p>👋 Hello and welcome to my personal website 👋</p>
        <p>
          I'm a Staff Software Engineer and have worked at startups for most of
          my career. I've used Ruby on Rails that entire time and most recently
          I've been leaning into learning Typescript.
        </p>
        <p>
          My software engineering experience has primarily been in product
          facing roles and I've come to love building and shipping high quality
          experiences to customers. I also enjoy writing technical walk throughs
          as well as sharing my general thoughts on software engineering.
        </p>
      </div>
    </div>
  );
}
