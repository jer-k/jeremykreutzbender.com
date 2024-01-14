import Link from "next/link";
import Image from "next/image";

import { Post } from "@/types/types";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card";

type BlogCardProps = {
  post: Post;
};

/*
    <Image
      alt="Post Image 5"
      className="w-full h-auto rounded-md"
      height="200"
      src="/placeholder.svg"
      style={{
        aspectRatio: "300/200",
        objectFit: "cover",
      }}
      width="300"
    />
 */
export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>{post.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Link
          className="text-blue-500 hover:underline"
          href={`/blog/${post.slug}`}
        >
          Read More
        </Link>
      </CardFooter>
    </Card>
  );
}
