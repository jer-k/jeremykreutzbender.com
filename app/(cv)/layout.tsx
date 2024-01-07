import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return <div className="bg-white">{children}</div>;
}
