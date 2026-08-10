export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

interface CustomSearchApiItem {
  title?: string;
  link?: string;
  snippet?: string;
}

interface CustomSearchApiResponse {
  items?: CustomSearchApiItem[];
  error?: { message?: string };
}

/** Google Custom Search JSON API — https://www.googleapis.com/customsearch/v1 */
export async function searchGoogle(
  query: string,
  apiKey: string,
  searchEngineId: string,
  num = 5,
): Promise<SearchResult[]> {
  const url = new URL("https://www.googleapis.com/customsearch/v1");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("cx", searchEngineId);
  url.searchParams.set("q", query);
  url.searchParams.set("num", String(Math.min(num, 10)));

  const res = await fetch(url.toString());
  const data = (await res.json().catch(() => null)) as CustomSearchApiResponse | null;

  if (!res.ok) {
    throw new Error(`Google Search request failed: ${res.status} ${data?.error?.message ?? ""}`.trim());
  }

  return (data?.items ?? [])
    .filter((item): item is Required<CustomSearchApiItem> => Boolean(item.title && item.link))
    .map((item) => ({ title: item.title, url: item.link, snippet: item.snippet ?? "" }));
}
