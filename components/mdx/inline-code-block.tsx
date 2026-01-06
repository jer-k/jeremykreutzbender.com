import type { PropsWithChildren } from "react";

export function InlineCodeBlock({ children }: PropsWithChildren) {
  return (
    <code
      className="not-prose font-mono text-sm text-solarized-light-foreground bg-solarized-light
      dark:text-solarized-dark-foreground dark:bg-solarized-dark rounded-md px-1.5 py-1"
    >
      {children}
    </code>
  );
}
