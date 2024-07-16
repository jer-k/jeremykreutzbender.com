import { PropsWithChildren } from "react";

export function Blockquote({ children }: PropsWithChildren) {
  return (
    <blockquote className="border-l-4 border-l-gleam dark:border-l-dusk">
      {children}
    </blockquote>
  );
}
