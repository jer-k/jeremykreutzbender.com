import { Button } from "@/components/ui/button";

type Props = {
  href: string;
};
export function LinkedInIconButton({ href }: Props) {
  return (
    <a href={href} target="_blank">
      <Button className="p-0" variant="link">
        <svg
          className="h-6 w-6 text-primary hover:text-primary/70 dark:text-bright dark:hover:text-bright/70"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect height="12" width="4" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
        <span className="sr-only">LinkedIn</span>
      </Button>
    </a>
  );
}
