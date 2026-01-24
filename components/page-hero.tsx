import Image from "next/image";
import { ReactNode } from "react";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export function PageHero({ title, subtitle, children }: PageHeroProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center py-8">
        <h1 className="font-bold text-3xl text-center">{title}</h1>
        {subtitle && (
          <h2 className="font-semibold text-xl text-center">{subtitle}</h2>
        )}
        {children}
      </div>
      <div className="w-full relative h-24">
        <Image
          src="/images/waves.svg"
          alt="Decorative wave pattern"
          fill
          className="object-cover dark:hidden"
          priority
        />
        <Image
          src="/images/waves-dark.svg"
          alt="Decorative wave pattern"
          fill
          className="object-cover hidden dark:block"
          priority
        />
      </div>
    </div>
  );
}
