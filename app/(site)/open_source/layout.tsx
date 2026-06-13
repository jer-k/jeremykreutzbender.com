import { ReactNode } from "react";

export default function ContentLayout({ children }: { children: ReactNode }) {
  return <div className="w-full">{children}</div>;
}
