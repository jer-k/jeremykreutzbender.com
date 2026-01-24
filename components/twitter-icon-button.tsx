import { Button } from "@/components/ui/button";

type Props = {
  href: string;
};
export function TwitterIconButton({ href }: Props) {
  return (
    <Button
      variant="link"
      size="icon"
      className="hover:text-primary/90"
      nativeButton={false}
      render={
        <a href={href} target="_blank" rel="noopener noreferrer">
          <svg
            className="size-6"
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
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
          </svg>
          <span className="sr-only">Twitter</span>
        </a>
      }
    />
  );
}
