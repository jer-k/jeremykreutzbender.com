import { PropsWithChildren } from "react";

export function Blockquote({ children }: PropsWithChildren) {
  return (
    <blockquote className="border-l-gray-100 dark:border-l-dusk">
      {children}
    </blockquote>
  );
}
