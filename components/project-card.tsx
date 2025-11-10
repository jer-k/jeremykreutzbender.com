import ReactMarkdown from "react-markdown";

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
      <CardContent className="prose prose-li:marker:text-black p-0 ps-4 w-full text-xs">
        <ReactMarkdown>{descriptionMarkdown}</ReactMarkdown>
      </CardContent>
    </Card>
  );
}
