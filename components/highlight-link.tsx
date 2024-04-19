import Link from "next/link";

type Props = {
  href: string;
  label: string;
};
export function HighlightLink({ href, label }: Props) {
  return (
    <Link
      className="text-primary hover:text-primary/70 dark:text-bright dark:hover:text-bright/70"
      aria-label={label}
      href={href}
    >
      {label}
    </Link>
  );
}
