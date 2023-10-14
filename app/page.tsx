import { Progress } from "@/components/ui/progress";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 py-4">
      <h3>This site is under construction</h3>
      <p>
        I&apos;ve never used Tailwind before so bear with me as I learn how to
        style stuff
      </p>
      <Progress value={10} className="w-[60%]" />
    </div>
  );
}
