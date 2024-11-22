export function CodeblockTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className="rehype-code-title pt-4 px-4 pb-0 rounded-t-md mb-0 text-sm font-normal
			           bg-solaralizedlight-darkened dark:bg-solaralizeddark-darkened"
      {...props}
    >
      <span
        className="rehype-code-title-content relative p-1 -left-[6px] top-[6px]
				           inline-block whitespace-nowrap overflow-x-auto max-w-full
			             bg-solaralizedlight dark:bg-solaralizeddark"
      >
        {children}
      </span>
    </div>
  );
}
