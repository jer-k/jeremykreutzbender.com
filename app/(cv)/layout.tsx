import { ReactNode } from "react";

export default function CvLayout({ children }: { children: ReactNode }) {
  return <div className="bg-white">{children}</div>;
}
