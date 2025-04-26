import { ReactNode } from "react";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

type Props = {
  children: ReactNode;
};
export default function SiteLayout({ children }: Props) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div>
          <Header />
          <main className="flex flex-col justify-between px-16 pt-4">
            {children}
          </main>
          <Toaster richColors />
          <Footer />
        </div>
      </ThemeProvider>
    </>
  );
}
