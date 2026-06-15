import { mediaQuery } from "./constants";

export function getSystemTheme(event?: MediaQueryList | MediaQueryListEvent) {
  const source = event ?? window.matchMedia(mediaQuery);
  return source.matches ? "dark" : "light";
}

export function addMediaListener(
  media: MediaQueryList,
  listener: (event: MediaQueryList | MediaQueryListEvent) => void,
) {
  media.addEventListener("change", listener);
}

export function removeMediaListener(
  media: MediaQueryList,
  listener: (event: MediaQueryList | MediaQueryListEvent) => void,
) {
  media.removeEventListener("change", listener);
}
