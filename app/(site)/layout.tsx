import { ReactNode } from "react";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";

type Props = {
  children: ReactNode;
  hero?: ReactNode;
};

export default function SiteLayout({ children, hero }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header>
        <Navbar />
        {hero}
      </Header>
      <main className="flex-1 flex flex-col max-w-240 mx-auto w-full px-5 pt-4">
        {children}
      </main>
      <Toaster />
      <Footer />
    </div>
  );
}
