import Image from "next/image";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function Header({ children }: Props) {
  return (
    <div className="relative overflow-hidden">
      <div className="relative z-10">{children}</div>
      {/* The wave would go in the div below */}
      {/* <div className="w-full relative h-24 z-10" /> */}
    </div>
  );
}
