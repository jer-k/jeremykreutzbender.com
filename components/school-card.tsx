import type { School } from "@/types/cv";

import { GlobeIcon } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SchoolCard({ school }: { school: School }) {
  const {
    institutionName,
    institutionUrl,
    department,
    departmentUrl,
    location,
    locationUrl,
    duration,
    degree,
    achievement,
  } = school;

  return (
    <Card className="bg-white py-4">
      <CardHeader className="py-0">
        <div className="flex items-start justify-between gap-x-2 text-base">
          <h3 className="flex flex-col space-y-1 font-semibold leading-none">
            <a
              className="hover:underline"
              href={institutionUrl}
              target="_blank"
              rel="noreferrer"
            >
              {institutionName}
            </a>
            {department && (
              <a
                className="text-sm text-gray-500 hover:underline"
                href={departmentUrl}
                target="_blank"
                rel="noreferrer"
              >
                {department}
              </a>
            )}
          </h3>
          <div className="text-sm tabular-nums text-gray-500">{duration}</div>
        </div>
      </CardHeader>
      <CardContent className="py-0 mt-2 text-xs">
        <p className="max-w-md items-center text-pretty font-mono text-xs text-muted-foreground">
          <a
            className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
            href={locationUrl}
            target="_blank"
            rel="noreferrer"
          >
            <GlobeIcon className="size-3" />
            {location}
          </a>
        </p>
        <p>
          {degree ? `${degree} - ` : ""}
          {achievement}
        </p>
      </CardContent>
    </Card>
  );
}
