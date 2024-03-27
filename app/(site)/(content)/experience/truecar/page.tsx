import { Progress } from "@/components/ui/progress";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience - TrueCar",
  description: "Projects I worked on while at TrueCar",
};

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 py-4">
      <h3>Experience is under construction</h3>
      <Progress value={0} className="w-[60%]" />
    </div>
  );
}
