import { ReactElement } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";

type Props = {
  title: string;
  description: string | ReactElement;
  href: string;
  externalLink?: boolean;
};
export function HeroCard({
  title,
  description,
  href,
  externalLink = false,
}: Props) {
  const card = (
    <Card className="w-full shadow-lg hover:shadow-xl hover:scale-101">
      <CardHeader className="p-4">
        <CardTitle className="text-primary dark:text-bright">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );

  return externalLink ? (
    <a className="flex w-full" href={href} target="_blank">
      {card}
    </a>
  ) : (
    <Link className="flex w-full" href={href}>
      {card}
    </Link>
  );
}
