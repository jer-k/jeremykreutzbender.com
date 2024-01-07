import { ReactNode } from "react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="flex flex-col h-screen justify-between px-16 pt-4">
          <Header />
          {children}
          <Toaster />
          <Footer />
        </div>
      </ThemeProvider>
    </>
  );
}
