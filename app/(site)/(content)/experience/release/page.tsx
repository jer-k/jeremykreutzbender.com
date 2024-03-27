import type { Metadata } from "next";

import ReleaseMdx from "./release.mdx";

export const metadata: Metadata = {
  title: "Experience - Release",
  description: "Projects I worked on while at Release",
};

export default function About() {
  return <ReleaseMdx />;
}
