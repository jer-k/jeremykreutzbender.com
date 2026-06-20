import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

export interface ImageWithCaptionProps extends ImageProps {
  as?: "figure" | "span";
  caption: string;
}

export function ImageWithCaption({
  as = "figure",
  alt,
  caption,
  className,
  style,
  title,
  ...props
}: ImageWithCaptionProps) {
  const image = (
    <Image
      alt={alt}
      className={cn("rounded-lg", className)}
      sizes="100vw"
      style={{
        width: "100%",
        height: "auto",
        ...style,
      }}
      width={450}
      height={450}
      placeholder="blur"
      blurDataURL="@/public/post_images/1x1-fafaf07f.png"
      {...props}
    />
  );

  return (
    <figure className="my-4">
      {image}
      <figcaption className="mt-2 text-center text-sm text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}
