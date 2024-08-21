import { PropsWithChildren } from "react";

import { Blockquote } from "@/components/mdx/blockquote";

type Props = {
  link: string;
  linkText?: string;
} & PropsWithChildren;

export function BlockquoteWithLink({ link, linkText, children }: Props) {
  return (
    <div className="my-6">
      <Blockquote noMargin>{children}</Blockquote>
      <div className="flex justify-center -mt-6">
        <a href={link}>{linkText || link}</a>
      </div>
    </div>
  );
}
