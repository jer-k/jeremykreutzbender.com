import { ReactElement } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type Props = {
  companyName: string;
  companyUrl?: string;
  workType: "On-Site" | "Remote";
  duration: string;
  title: string;
  description: ReactElement;
};

export function WorkExperienceCard({
  companyName,
  companyUrl,
  workType,
  duration,
  title,
  description,
}: Props) {
  return (
    <Card className="bg-white py-4">
      <CardHeader className="py-0">
        <div className="flex items-center justify-between gap-x-2 text-base">
          <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none">
            {companyUrl ? (
              <a className="hover:underline" href={companyUrl}>
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
      <CardContent className="py-0 mt-2 text-xs">{description}</CardContent>
      <CardFooter className="py-0 mt-2 print:hidden">
        <div className="flex items-center justify-end w-full">
          {/*<Link className="hover:underline" href={`experience/${companyName.toLowerCase().replace(/\W/, "")}`}><div className="text-xs">Read more about my time at {companyName} &gt;</div></Link>*/}
        </div>
      </CardFooter>
    </Card>
  );
}
