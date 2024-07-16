"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import clsx from "clsx";

type Props = {
  href: string;
  label: string;
};
export function HighlightLink({ href, label }: Props) {
  const pathname = usePathname();
  const pathMatch = href === "/" ? pathname === href : pathname.includes(href);
  return (
    <Link
      className={clsx(
        "text-primary hover:text-primary/70 dark:text-bright dark:hover:text-bright/70",
        {
          "text-shine": pathMatch,
          "dark:text-cloud": pathMatch,
        },
      )}
      aria-label={label}
      href={href}
    >
      {label}
    </Link>
  );
}
