import {
  Pagination as BasePagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function previousLink(path: string, page: number) {
  if (page === 1) {
    return "";
  }

  if (page === 2) {
    return path;
  }

  return `${path}/?page=${page - 1}`;
}

function nextLink(path: string, numPages: number, page: number) {
  if (page === 1) {
    return `${path}/?page=2`;
  }

  if (page === numPages) {
    return "";
  }
  return `${path}/?page=${page + 1}`;
}

type PaginationProps = {
  page: number;
  numPages: number;
  path: string;
};

export function Pagination({ page, numPages, path }: PaginationProps) {
  const paginationLinks = [];
  for (let i = 1; i <= numPages; i++) {
    let href: string;
    if (i === 1) {
      href = path;
    } else {
      href = `${path}/?page=${i}`;
    }
    const linkParams =
      i === page ? { isActive: true, href: href } : { href: href };

    paginationLinks.push(
      <PaginationItem key={`page-${i}`}>
        <PaginationLink {...linkParams}>{i}</PaginationLink>
      </PaginationItem>,
    );
  }

  return (
    <BasePagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={page === 1}
            href={previousLink(path, page)}
          />
        </PaginationItem>
        {paginationLinks}
        <PaginationItem>
          <PaginationNext
            disabled={page === numPages}
            href={nextLink(path, numPages, page)}
          />
        </PaginationItem>
      </PaginationContent>
    </BasePagination>
  );
}
