/** Image URL helpers — only verified, hotlink-friendly sources. */

export function slugify(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "travel"
  );
}

export function unsplashPhotoUrl(photoId: string, width: number, height: number): string {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=85`;
}

/** Fixed Picsum gallery id — last-resort fallback only. */
export function picsumIdUrl(id: number, width: number, height: number): string {
  return `https://picsum.photos/id/${id}/${width}/${height}`;
}
