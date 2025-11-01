/**
 * Helpers to extract product id and price from an Albert Heijn (AH) product URL/HTML.
 *
 * Notes:
 * - Parsing HTML from the browser by fetching AH pages will usually hit CORS and fail.
 *   Use this helper server-side (node) or pass the page HTML to `parsePriceFromHtml`.
 * - The extractor tries multiple strategies:
 *   1. find and parse JSON-LD (<script type="application/ld+json">) and read offers.price
 *   2. meta tags like `product:price:amount`
 *   3. loose regex search for euro amounts (fallback)
 */

export function extractProductId(url: string): string | null {
  try {
    const u = new URL(url);
    // AH product urls often look like /producten/product/<id>/slug
    const parts = u.pathname.split('/').filter(Boolean);
    const prodIndex = parts.indexOf('product');
    if (prodIndex >= 0 && parts.length > prodIndex + 1) {
      return parts[prodIndex + 1];
    }
    // sometimes path may be /producten/<id>/...
    const prodIndex2 = parts.indexOf('producten');
    if (prodIndex2 >= 0 && parts.length > prodIndex2 + 2 && parts[prodIndex2 + 1] === 'product') {
      return parts[prodIndex2 + 2];
    }
    return null;
  } catch (e) {
    return null;
  }
}

function parseNumberFromString(s: string): number | null {
  if (!s) return null;
  // normalize comma decimal and remove non-digits except dot
  const cleaned = s.replace(/€/g, '').replace(/\s+/g, '').replace(',', '.');
  const m = cleaned.match(/-?\d+(?:\.\d+)?/);
  if (!m) return null;
  const n = Number(m[0]);
  return Number.isFinite(n) ? n : null;
}

/**
 * Parse price (EUR) from AH product page HTML.
 * Returns numeric value (e.g. 1.49) or null when not found.
 */
export function parsePriceFromHtml(html: string): number | null {
  if (!html) return null;

  // 1) Find JSON-LD scripts and try to parse offers.price
  try {
    const ldJsonRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match: RegExpExecArray | null;
    while ((match = ldJsonRegex.exec(html)) !== null) {
      const jsonText = match[1].trim();
      try {
        const obj = JSON.parse(jsonText);
        // JSON-LD may be an array
        const entries = Array.isArray(obj) ? obj : [obj];
        for (const e of entries) {
          if (!e) continue;
          // offers may be object or array
          const offers = e.offers || (e['@graph'] && e['@graph'].find((g: any) => g.offers)?.offers);
          const tryOffers = offers && (Array.isArray(offers) ? offers : [offers]);
          if (tryOffers) {
            for (const o of tryOffers) {
              if (!o) continue;
              if (o.price) {
                const n = parseNumberFromString(String(o.price));
                if (n !== null) return n;
              }
              if (o.priceSpecification && o.priceSpecification.price) {
                const n = parseNumberFromString(String(o.priceSpecification.price));
                if (n !== null) return n;
              }
            }
          }
        }
      } catch (_) {
        // ignore malformed JSON and continue
      }
    }
  } catch (_) {
    // ignore
  }

  // 2) meta property
  try {
    const metaRegex = /<meta[^>]+(property|name)=["'](?:product:price:amount|og:price:amount)["'][^>]*content=["']([^"']+)["'][^>]*>/i;
    const m = html.match(metaRegex);
    if (m && m[2]) {
      const n = parseNumberFromString(m[2]);
      if (n !== null) return n;
    }
  } catch (_) {}

  // 3) look for common price patterns like "€ 1,49" or "1,49" near words 'per' or 'prijs'
  try {
    // search for euro symbol nearby
    const euroRegex = /€\s*([0-9]+(?:[.,][0-9]{1,2})?)/g;
    let last: RegExpExecArray | null = null;
    let m2: RegExpExecArray | null;
    while ((m2 = euroRegex.exec(html)) !== null) {
      last = m2; // take last occurrence (usually product price appears later in the page)
    }
    if (last && last[1]) {
      const n = parseNumberFromString(last[1]);
      if (n !== null) return n;
    }

    // fallback: any number with comma and two decimals
    const fallback = html.match(/([0-9]+,[0-9]{2})/);
    if (fallback && fallback[1]) {
      const n = parseNumberFromString(fallback[1]);
      if (n !== null) return n;
    }
  } catch (_) {}

  return null;
}

/**
 * Fetches the AH URL and attempts to extract price. Returns numeric price or null.
 * NOTE: This may fail in browsers due to CORS — prefer server-side usage or use `parsePriceFromHtml`.
 */
export async function fetchPriceFromAhUrl(url: string): Promise<number | null> {
  try {
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) return null;
    const html = await res.text();
    return parsePriceFromHtml(html);
  } catch (e) {
    // network or CORS error
    return null;
  }
}

export default {
  extractProductId,
  parsePriceFromHtml,
  fetchPriceFromAhUrl,
};
