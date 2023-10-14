import { Progress } from "@/components/ui/progress";

export default function Videos() {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 py-4">
      <h3>Videos are under construction</h3>
      <p>Well I haven&apos;t actually recorded anything yet, but someday</p>
      <Progress value={0} className="w-[60%]" />
    </div>
  );
}
