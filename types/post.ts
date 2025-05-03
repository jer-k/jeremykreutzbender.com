export type Post = {
  draft: boolean;
  title: string;
  slug: string;
  date: string;
  updated?: string;
  tags: string[];
  description: string;
  content: string;
  href?: string;
};
