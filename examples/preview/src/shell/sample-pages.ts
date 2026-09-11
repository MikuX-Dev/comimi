import type { MangaPage } from "../../../../src";

const sampleImages = import.meta.glob("../../sample-comic/*.webp", {
  eager: true,
  query: "?url",
  import: "default"
}) as Record<string, string>;

export function loadSampleImagePages(): MangaPage[] {
  return Object.entries(sampleImages)
    .map(([path, url]) => {
      const match = path.match(/\/(\d+)\.webp$/);
      if (!match) {
        return null;
      }
      return { index: Number(match[1]), url };
    })
    .filter((entry): entry is { index: number; url: string } => entry !== null)
    .sort((a, b) => a.index - b.index)
    .map(({ index, url }) => ({
      id: `p${index}`,
      type: "image",
      src: url,
      alt: `Page ${index + 1}`
    }));
}
