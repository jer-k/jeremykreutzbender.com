import { ModeToggle } from "@/components/ui/mode-toggle";

export function Header() {
  return (
    <div className="hidden h-full flex-col md:flex">
      <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
        <h2 className="text-lg font-semibold">Playground</h2>
        <ModeToggle />
      </div>
    </div>
  );
}
