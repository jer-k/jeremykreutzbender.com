import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Post } from "@/types/post";

type BlogCardProps = {
  post: Post;
};

export function BlogCard({ post }: BlogCardProps) {
  let href;
  let host;
  let externalLink = false;
  if (post.href) {
    href = post.href;
    host = new URL(href).host;
    externalLink = true;
  } else {
    href = `/blog/${post.slug}`;
  }

  const cardFooter = externalLink ? (
    <CardFooter className="pt-2 pb-6">
      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-row space-x-2 items-center ">
          <p>{host}</p>
          <ExternalLinkIcon className="h-4 w-4" />
        </div>
        <div className="flex text-xs">{post.date}</div>
      </div>
    </CardFooter>
  ) : (
    <CardFooter className="pt-2 pb-6">
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-row items-center justify-end w-full">
          <div className="flex text-xs">{post.date}</div>
        </div>
        <div className="flex flex-row items-center justify-end gap-2 w-full">
          {post.tags.map((tag) => (
            <Badge variant="secondary" key={tag}>
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </CardFooter>
  );
  const card = (
    <Card className="shadow-lg hover:shadow-xl hover:scale-101">
      <CardHeader className="pb-0">
        <CardTitle className="text-primary text-2xl font-semibold leading-none tracking-tight dark:text-bright">
          {post.title}
        </CardTitle>
        <CardDescription>{post.description}</CardDescription>
      </CardHeader>
      {cardFooter}
    </Card>
  );

  return externalLink ? (
    <a href={href} target="_blank">
      {card}
    </a>
  ) : (
    <Link href={href}>{card}</Link>
  );
}
