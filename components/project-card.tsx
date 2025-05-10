import type { Project } from "@/types/cv";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ProjectCard({ project }: { project: Project }) {
  const { name, url, descriptionMarkdown } = project;

  return (
    <Card className="bg-white py-4">
      <CardHeader className="py-0">
        <a
          className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
          href={url}
          target="_blank"
          rel="noreferrer"
        >
          {name}
        </a>
      </CardHeader>
      <CardContent className="py-0 mt-2 text-xs">
        <ul className="list-disc ps-4">
          <li>
            Personal website (you&apos;re on it right now!) built with Next.js
            App Router, React, and Typescript
          </li>
          <li>
            I&apos;m using this website as a platform for writing blog posts,
            learning Typescript, and a playground to try out new features in
            React and Next.js
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
