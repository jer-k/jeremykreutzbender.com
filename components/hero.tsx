import Image from "next/image";

import { HeroCard } from "@/components/hero-card";

import heroPic from "@/public/me/new-zealand.jpg";

export function Hero() {
  return (
    <div className="max-w-5xl flex flex-col space-y-4 lg:grid lg:grid-cols-3 lg:grid-rows-2 lg:gap-x-4 [grid-template-areas:'header_hero_hero''sub_hero_hero']">
      <div className="flex [grid-area:hero]">
        <Image
          priority
          alt="Hero Image"
          className="aspect-content rounded-lg object-cover object-center"
          src={heroPic}
          placeholder="blur"
        />
      </div>
      <div className="flex flex-col items-start space-y-2 [grid-area:header]">
        <h1 className="text-primary dark:text-bright font-bold tracking-tighter text-4xl lg:text-5xl">
          Jeremy Kreutzbender
        </h1>
        <h3 className="text-primary dark:text-bright font-bold tracking-tighter text-2xl lg:text-3xl">
          Product Engineer
        </h3>
        <p className="text-primary dark:text-bright">
          Hello from Portland, OR and welcome to my website! My software journey
          currently has me learning as much as I can about delivering great user
          experiences through product engineering.
        </p>
      </div>
      <div className="flex [grid-area:sub]">
        <div className="flex flex-col items-start space-y-2 h-full w-full lg:justify-between">
          <HeroCard
            title="Open Source"
            description="Contributions I've made to open source projects"
            href="/open_source"
          />
          <HeroCard
            title="Online CV"
            description="An interactive version of my work history"
            href="/cv"
          />
          <HeroCard
            externalLink
            title="Storybook"
            description="Components I've built for this site"
            href="https://storybook.jeremykreutzbender.com"
          />
        </div>
      </div>
    </div>
  );
}
