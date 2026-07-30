"use client";

import { Code2 } from "lucide-react";
import * as React from "react";
import type {} from "react/canary";

import { OpenSourceExpansionPanel } from "@/components/open-source/open-source-expansion-panel";
import { OpenSourceRepositoryCard } from "@/components/open-source/open-source-repository-card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { RepositoryContributionGroup } from "@/lib/open-source";

type OpenSourceGridProps = {
  repositories: RepositoryContributionGroup[];
  initialRepository?: string;
};

type ViewTransitionProps = React.ViewTransitionProps;

type ReactWithViewTransitions = typeof React & {
  ViewTransition?: React.ExoticComponent<ViewTransitionProps>;
  addTransitionType?: (type: string) => void;
};

const ReactWithTransitions = React as ReactWithViewTransitions;

function ViewTransitionBoundary(props: ViewTransitionProps) {
  const Component = ReactWithTransitions.ViewTransition;

  if (Component) {
    return <Component {...props} />;
  }

  return <>{props.children}</>;
}

function useGridColumnCount() {
  const getColumnCount = React.useCallback(() => {
    if (typeof window === "undefined") {
      return 1;
    }

    if (window.matchMedia("(min-width: 1024px)").matches) {
      return 3;
    }

    return window.matchMedia("(min-width: 768px)").matches ? 2 : 1;
  }, []);
  const [columnCount, setColumnCount] = React.useState(getColumnCount);

  React.useEffect(() => {
    const queries = [
      window.matchMedia("(min-width: 768px)"),
      window.matchMedia("(min-width: 1024px)"),
    ];
    const updateColumnCount = () => setColumnCount(getColumnCount());

    for (const query of queries) {
      query.addEventListener("change", updateColumnCount);
    }

    return () => {
      for (const query of queries) {
        query.removeEventListener("change", updateColumnCount);
      }
    };
  }, [getColumnCount]);

  return columnCount;
}

export function OpenSourceGrid({
  repositories,
  initialRepository,
}: OpenSourceGridProps) {
  const columnCount = useGridColumnCount();
  const initialSelection = repositories.some(
    (repository) => repository.repository.nameWithOwner === initialRepository,
  )
    ? (initialRepository ?? null)
    : null;
  const [activeRepository, setActiveRepository] = React.useState<string | null>(
    initialSelection,
  );
  const triggerRefs = React.useRef<Record<string, HTMLButtonElement | null>>(
    {},
  );
  const shouldScrollToInitialSelection = React.useRef(
    Boolean(initialSelection),
  );

  const activeIndex = repositories.findIndex(
    (repository) => repository.repository.nameWithOwner === activeRepository,
  );
  const activeGroup =
    activeIndex === -1 ? undefined : repositories[activeIndex];
  const panelInsertionIndex =
    activeIndex === -1
      ? -1
      : Math.min(
          repositories.length - 1,
          activeIndex + (columnCount - 1 - (activeIndex % columnCount)),
        );

  const updateUrl = React.useCallback((repository: string | null) => {
    const url = new URL(window.location.href);

    if (repository) {
      url.searchParams.set("repository", repository);
    } else {
      url.searchParams.delete("repository");
    }

    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, []);

  const selectRepository = React.useCallback(
    (repository: string) => {
      React.startTransition(() => {
        ReactWithTransitions.addTransitionType?.("select-repository");
        setActiveRepository((currentRepository) => {
          const nextRepository =
            currentRepository === repository ? null : repository;
          updateUrl(nextRepository);
          return nextRepository;
        });
      });
    },
    [updateUrl],
  );

  const closePanel = React.useCallback(() => {
    if (!activeRepository) {
      return;
    }

    const repositoryToFocus = activeRepository;
    React.startTransition(() => {
      ReactWithTransitions.addTransitionType?.("collapse-repository");
      setActiveRepository(null);
      updateUrl(null);
    });
    window.requestAnimationFrame(() => {
      triggerRefs.current[repositoryToFocus]?.focus();
    });
  }, [activeRepository, updateUrl]);

  React.useEffect(() => {
    if (!shouldScrollToInitialSelection.current || !activeRepository) {
      return;
    }

    shouldScrollToInitialSelection.current = false;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document
          .getElementById(
            `repository-panel-${activeRepository.replaceAll("/", "-")}`,
          )
          ?.scrollIntoView?.({ block: "start", behavior: "smooth" });
      });
    });
  }, [activeRepository]);

  if (repositories.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <Code2 aria-hidden="true" className="size-5" />
          </EmptyMedia>
          <EmptyTitle>No open source contributions yet</EmptyTitle>
          <EmptyDescription>
            Merged pull requests from public repositories will appear here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div
      aria-label="Open source repositories"
      className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      role="list"
    >
      {repositories.map((repository, index) => (
        <React.Fragment key={repository.repository.nameWithOwner}>
          <ViewTransitionBoundary default="none" update="auto">
            <div role="listitem">
              <OpenSourceRepositoryCard
                group={repository}
                isActive={
                  repository.repository.nameWithOwner === activeRepository
                }
                onSelect={() =>
                  selectRepository(repository.repository.nameWithOwner)
                }
                triggerRef={(element) => {
                  triggerRefs.current[repository.repository.nameWithOwner] =
                    element;
                }}
              />
            </div>
          </ViewTransitionBoundary>
          {activeGroup && index === panelInsertionIndex && (
            <ViewTransitionBoundary
              default="none"
              enter="slide-up"
              exit="slide-down"
              key={`panel-${activeGroup.repository.nameWithOwner}`}
            >
              <OpenSourceExpansionPanel
                group={activeGroup}
                onClose={closePanel}
              />
            </ViewTransitionBoundary>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
