import { ReactNode } from "react";

export default function ContentLayout({ children }: { children: ReactNode }) {
  return <div className="md:w-full md:flex md:justify-center">{children}</div>;
}
