import Image, { type ImageProps } from "next/image";

export function MdxImage(props: ImageProps) {
  const isGif =
    typeof props.src === "string" && /\.gif(?:[?#].*)?$/i.test(props.src);

  return (
    <Image
      sizes="100vw"
      style={{
        width: "100%",
        height: "auto",
        marginTop: "16px",
        marginBottom: "16px",
      }}
      width={450}
      height={450}
      placeholder="blur"
      blurDataURL="/post_images/1x1-fafaf07f.png"
      {...props}
      unoptimized={isGif || props.unoptimized}
    />
  );
}
