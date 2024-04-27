import { PropsWithChildren } from "react";

type Props = {
  heading: string;
} & PropsWithChildren;
export function Aside({ heading, children }: Props) {
  return (
    <aside className="p-4 border-l-4 border-l-blue-400 rounded-xl bg-gray-100 dark:bg-dusk">
      <h6 className="font-bold">{heading}</h6>
      {children}
    </aside>
  );
}
