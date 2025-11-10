import { ReactNode } from "react";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster";

type Props = {
  children: ReactNode;
};
export default function SiteLayout({ children }: Props) {
  return (
    <>
      <Header />
      <main className="flex flex-col justify-between px-16 pt-4">
        {children}
      </main>
      <Toaster />
      <Footer />
    </>
  );
}
