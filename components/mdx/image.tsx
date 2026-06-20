import Image, { type ImageProps } from "next/image";

export type MdxImageProps = ImageProps & {
  maxWidth?: number;
};

export function MdxImage({ maxWidth, style, ...props }: MdxImageProps) {
  const isGif =
    typeof props.src === "string" && /\.gif(?:[?#].*)?$/i.test(props.src);

  return (
    <Image
      sizes={
        props.sizes ??
        (maxWidth ? `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px` : "100vw")
      }
      style={{
        display: "block",
        width: "100%",
        maxWidth: maxWidth ? `${maxWidth}px` : undefined,
        height: "auto",
        margin: "16px auto",
        ...style,
      }}
      width={props.width ?? 450}
      height={props.height ?? 450}
      placeholder="blur"
      blurDataURL="/post_images/1x1-fafaf07f.png"
      {...props}
      unoptimized={isGif || props.unoptimized}
    />
  );
}
