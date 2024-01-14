import { ReactNode } from "react";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex justify-center">
      <div className="prose">{children}</div>
    </div>
  );
}
