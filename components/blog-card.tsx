import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
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

  const content = (
    <article className="group py-4">
      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-2xl font-semibold group-hover:underline">
            {post.title}
          </h3>
          <p className="text-muted-foreground mt-2">{post.description}</p>
        </div>
        <div className="flex flex-col items-start justify-start gap-2 text-sm">
          <div className="flex flex-row gap-2">
            <span className="text-muted-foreground">{post.date}</span>
            {externalLink && (
              <>
                <span className="text-muted-foreground">{host}</span>
                <ExternalLinkIcon className="h-4 w-4 text-muted-foreground" />
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2 items-center justify-end">
            {post.tags.map((tag) => (
              <Badge variant="secondary" key={tag}>
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </article>
  );

  return externalLink ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <Link href={href}>{content}</Link>
  );
}
