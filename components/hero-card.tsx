import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";

type Props = {
  title: string;
  description: string;
  href: string;
};
export function HeroCard({ title, description, href }: Props) {
  return (
    <Link className="flex w-full" href={href}>
      <Card className="w-full shadow-lg hover:shadow-xl hover:scale-101">
        <CardHeader className="p-4">
          <CardTitle className="text-primary dark:text-bright">
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
