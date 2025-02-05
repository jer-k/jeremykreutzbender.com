import type { PropsWithChildren } from "react";

export function InlineCodeBlock({ children }: PropsWithChildren) {
  return (
    <code
      className="not-prose font-mono text-sm text-solaralizedlight-foreground bg-solaralizedlight
      dark:text-solaralizeddark-foreground dark:bg-solaralizeddark rounded-md px-1.5 py-1"
    >
      {children}
    </code>
  );
}
