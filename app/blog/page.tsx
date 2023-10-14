import { Progress } from "@/components/ui/progress";

export default function Blog() {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 py-4">
      <h3>Blog is under construction</h3>
      <p>I need to figure out how to render Markdown files in Next</p>
      <Progress value={0} className="w-[60%]" />
    </div>
  );
}
