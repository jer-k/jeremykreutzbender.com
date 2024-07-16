import { PropsWithChildren } from "react";

type Props = {
  heading: string;
} & PropsWithChildren;
export function Aside({ heading, children }: Props) {
  return (
    <aside className="p-4 border-l-4 border-l-gleam rounded-xl bg-solaralizedlight dark:bg-solaralizeddark dark:border-l-cloud">
      <h6 className="font-bold">{heading}</h6>
      {children}
    </aside>
  );
}
