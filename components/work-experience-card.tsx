import { Job } from "@/types/cv";

import ReactMarkdown from "react-markdown";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  job: Job;
};

export function WorkExperienceCard({ job }: Props) {
  const {
    companyName,
    companyUrl,
    workType,
    duration,
    title,
    descriptionMarkdown,
  } = job;

  return (
    <Card className="bg-white py-4">
      <CardHeader className="py-0">
        <div className="flex items-center justify-between gap-x-2 text-base">
          <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none">
            {companyUrl ? (
              <a
                className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                href={companyUrl}
                target="_blank"
              >
                {companyName}
              </a>
            ) : (
              companyName
            )}
            <span className="inline-flex gap-x-1">
              <Badge variant="secondary" className="align-middle text-xs">
                {workType}
              </Badge>
            </span>
          </h3>
          <div className="text-sm tabular-nums text-gray-500">{duration}</div>
        </div>
        <div className="flex items-center justify-between gap-x-2 text-base">
          <h4 className="font-mono text-sm leading-none">{title}</h4>
        </div>
      </CardHeader>
      <CardContent className="prose p-0 ps-4 w-full text-xs">
        <ReactMarkdown>{descriptionMarkdown}</ReactMarkdown>
      </CardContent>
    </Card>
  );
}
