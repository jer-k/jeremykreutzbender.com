import { PropsWithChildren } from "react";

import clsx from "clsx";

type Props = {
  noMargin?: boolean;
} & PropsWithChildren;

export function Blockquote({ noMargin, children }: Props) {
  return (
    <blockquote
      className={clsx("border-l-4 border-l-gleam dark:border-l-dusk", {
        "my-0": noMargin,
      })}
    >
      {children}
    </blockquote>
  );
}
