import type { Metadata } from "next";

import AboutMdx from "./about.mdx";

export const metadata: Metadata = {
  title: "About",
  description: "All About Me",
};

export default function About() {
  return <AboutMdx />;
}
