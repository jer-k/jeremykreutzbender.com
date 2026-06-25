"use client";

import mermaid, { type MermaidConfig } from "mermaid";
import * as React from "react";
import { useTheme } from "@/lib/theme-provider";
import { cn } from "@/lib/utils";

export interface MermaidProps {
  chart: string;
  className?: string;
  config?: MermaidConfig;
  label?: string;
}

export interface MermaidLoadingProps {
  className?: string;
}

export interface MermaidErrorProps {
  className?: string;
  error: string;
  label: string;
}

const defaultConfig = {
  fontFamily: "var(--font-sans), Arial, sans-serif",
  securityLevel: "strict",
  startOnLoad: false,
} satisfies MermaidConfig;

const sharedThemeVariables = {
  fontFamily: "var(--font-sans), Arial, sans-serif",
  fontSize: "14px",
  primaryTextColor: "#1f1f24",
  secondaryTextColor: "#1f1f24",
  tertiaryTextColor: "#1f1f24",
} satisfies MermaidConfig["themeVariables"];

const lightThemeVariables = {
  ...sharedThemeVariables,
  actorBkg: "#f6efd2",
  actorBorder: "#38577a",
  actorTextColor: "#1f1f24",
  background: "#fcfaf0",
  edgeLabelBackground: "#fcfaf0",
  labelBoxBkgColor: "#f6efd2",
  labelBoxBorderColor: "#e4dcc8",
  lineColor: "#38577a",
  mainBkg: "#f6efd2",
  noteBkgColor: "#ead05a",
  noteBorderColor: "#c49022",
  noteTextColor: "#302f2b",
  primaryBorderColor: "#38577a",
  primaryColor: "#f6efd2",
  secondaryBorderColor: "#e4dcc8",
  secondaryColor: "#f5f4ef",
  signalColor: "#38577a",
  signalTextColor: "#1f1f24",
  tertiaryBorderColor: "#e4dcc8",
  tertiaryColor: "#fcfaf0",
} satisfies MermaidConfig["themeVariables"];

const darkThemeVariables = {
  ...sharedThemeVariables,
  actorBkg: "#18242d",
  actorBorder: "#78a9c9",
  actorTextColor: "#fcfaf0",
  background: "#101820",
  edgeLabelBackground: "#101820",
  labelBoxBkgColor: "#18242d",
  labelBoxBorderColor: "#34414b",
  lineColor: "#9aaab4",
  mainBkg: "#18242d",
  noteBkgColor: "#d7b94a",
  noteBorderColor: "#f3e6ad",
  noteTextColor: "#232323",
  primaryBorderColor: "#78a9c9",
  primaryColor: "#18242d",
  primaryTextColor: "#fcfaf0",
  secondaryBorderColor: "#34414b",
  secondaryColor: "#303236",
  secondaryTextColor: "#fcfaf0",
  signalColor: "#78a9c9",
  signalTextColor: "#fcfaf0",
  tertiaryBorderColor: "#34414b",
  tertiaryColor: "#101820",
  tertiaryTextColor: "#fcfaf0",
} satisfies MermaidConfig["themeVariables"];

function mermaidId(id: string) {
  return `mermaid-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unable to render diagram.";
}

export function MermaidLoading({ className }: MermaidLoadingProps) {
  return (
    <figure
      className={cn(
        "not-prose my-8 overflow-x-auto rounded-md border bg-background p-4",
        className,
      )}
    >
      <div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
        Rendering diagram...
      </div>
    </figure>
  );
}

export function MermaidError({ className, error, label }: MermaidErrorProps) {
  return (
    <figure
      className={cn(
        "not-prose my-8 rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive",
        className,
      )}
    >
      <figcaption className="font-medium">{label}</figcaption>
      <p className="mt-2 mb-0">{error}</p>
    </figure>
  );
}

export function Mermaid({
  chart,
  className,
  config,
  label = "Mermaid diagram",
}: MermaidProps) {
  const { resolvedTheme } = useTheme();
  const id = React.useId();
  const [svg, setSvg] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    const themeVariables =
      resolvedTheme === "dark" ? darkThemeVariables : lightThemeVariables;

    async function renderChart() {
      setError("");
      setSvg("");

      try {
        mermaid.initialize({
          ...defaultConfig,
          ...config,
          theme: config?.theme ?? "base",
          themeVariables: {
            ...themeVariables,
            ...config?.themeVariables,
          },
        });

        const result = await mermaid.render(mermaidId(id), chart.trim());

        if (!cancelled) {
          setSvg(result.svg);
        }
      } catch (renderError) {
        if (!cancelled) {
          setError(errorMessage(renderError));
        }
      }
    }

    renderChart();

    return () => {
      cancelled = true;
    };
  }, [chart, config, id, resolvedTheme]);

  if (error) {
    return <MermaidError className={className} error={error} label={label} />;
  }

  if (!svg) {
    return <MermaidLoading className={className} />;
  }

  return (
    <figure
      className={cn(
        "not-prose my-8 overflow-x-auto rounded-md border bg-background p-4",
        className,
      )}
    >
      <div
        aria-label={label}
        className="[&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
        // Mermaid returns sanitized SVG when securityLevel is strict.
        dangerouslySetInnerHTML={{ __html: svg }}
        role="img"
      />
    </figure>
  );
}
