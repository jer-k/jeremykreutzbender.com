export function CodeblockTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="rehype-code-title" {...props}>
      <span className="rehype-code-title-content">{children}</span>
    </div>
  );
}
