const API_URL = "https://en.wikipedia.org/w/api.php";

export async function fetchWikipediaHtml(title: string): Promise<string> {
  const params = new URLSearchParams({
    action: "parse",
    page: title,
    prop: "text",
    format: "json",
    origin: "*"
  });

  const response = await fetch(`${API_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Wikipedia request failed for ${title}: ${response.status}`);
  }

  const payload = (await response.json()) as {
    parse?: { text?: { "*": string } };
    error?: { info?: string };
  };

  if (payload.error) {
    throw new Error(payload.error.info ?? `Wikipedia returned an error for ${title}`);
  }

  const html = payload.parse?.text?.["*"];
  if (!html) {
    throw new Error(`Wikipedia response for ${title} did not include page HTML`);
  }

  return html;
}
