import type { PropsWithChildren } from "react";

type Props = {
  id?: string;
} & PropsWithChildren;
export function H2WithAnchor({ id, children }: Props) {
  return (
    <h2 className="group" id={id}>
      {children}
      <a
        aria-label={id}
        href={`#${id}`}
        className="p-2 italic font-bold opacity-0 group-hover:opacity-75"
      >
        #
      </a>
    </h2>
  );
}
