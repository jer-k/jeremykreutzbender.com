import { Progress } from "@/components/ui/progress";

export default function ProductEngineer() {
  return (
    <div>
      <h1>Product Engineer</h1>
      <h2>
        My thoughts on the term Product Engineer and why I like to think of
        myself as one
      </h2>
      <Progress value={0} className="w-[60%]" />
    </div>
  );
}
