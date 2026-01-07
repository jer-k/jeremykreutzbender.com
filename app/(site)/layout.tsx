import { ReactNode } from "react";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";

type Props = {
  children: ReactNode;
  hero?: ReactNode;
};
export default function SiteLayout({ children, hero }: Props) {
  return (
    <>
      <Header />
      {hero}
      <main className="flex flex-col justify-between px-16 pt-4">
        {children}
      </main>
      <Toaster />
      <Footer />
    </>
  );
}
