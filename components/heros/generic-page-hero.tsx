import { ReactNode } from "react";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export function GenericPageHero({ title, subtitle, children }: PageHeroProps) {
  return (
    <div className="flex flex-col items-center max-w-240 mx-auto w-full px-5 pt-10 pb-4 gap-2">
      <h1 className="font-bold text-3xl text-center">{title}</h1>
      {subtitle && (
        <h2 className="font-semibold text-xl text-center">{subtitle}</h2>
      )}
      {children}
    </div>
  );
}
