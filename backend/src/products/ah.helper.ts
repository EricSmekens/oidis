import axios from 'axios';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function choose<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function parseNumberFromString(s: string): number | null {
  if (!s) return null;
  const cleaned = s.replace(/€/g, '').replace(/\s+/g, '').replace(',', '.');
  const m = cleaned.match(/-?\d+(?:\.\d+)?/);
  if (!m) return null;
  const n = Number(m[0]);
  return Number.isFinite(n) ? n : null;
}

export function parsePriceFromHtml(html: string): number | null {
  if (!html) return null;

  try {
    const ldJsonRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match: RegExpExecArray | null;
    while ((match = ldJsonRegex.exec(html)) !== null) {
      const jsonText = match[1].trim();
      try {
        const obj = JSON.parse(jsonText);
        const entries = Array.isArray(obj) ? obj : [obj];
        for (const e of entries) {
          if (!e) continue;
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
      } catch (_) {}
    }
  } catch (_) {}

  try {
    const metaRegex = /<meta[^>]+(property|name)=["'](?:product:price:amount|og:price:amount)["'][^>]*content=["']([^"']+)["'][^>]*>/i;
    const m = html.match(metaRegex);
    if (m && m[2]) {
      const n = parseNumberFromString(m[2]);
      if (n !== null) return n;
    }
  } catch (_) {}

  try {
    const euroRegex = /€\s*([0-9]+(?:[.,][0-9]{1,2})?)/g;
    let last: RegExpExecArray | null = null;
    let m2: RegExpExecArray | null;
    while ((m2 = euroRegex.exec(html)) !== null) {
      last = m2;
    }
    if (last && last[1]) {
      const n = parseNumberFromString(last[1]);
      if (n !== null) return n;
    }

    const fallback = html.match(/([0-9]+,[0-9]{2})/);
    if (fallback && fallback[1]) {
      const n = parseNumberFromString(fallback[1]);
      if (n !== null) return n;
    }
  } catch (_) {}

  return null;
}

export async function fetchPriceFromAhUrl(url: string): Promise<number | null> {
  const userAgents = [
    // modern desktop Chrome
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    // Firefox
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:119.0) Gecko/20100101 Firefox/119.0',
    // Edge
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
    // Mobile Safari
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  ];

  const secCH = (ua: string) => {
    // crude mapping for sec-ch-ua values
    if (ua.includes('Chrome')) return '"Chromium";v="119", "Google Chrome";v="119", "Not;A Brand";v="99"';
    if (ua.includes('Firefox')) return '"Firefox";v="119", "Not;A Brand";v="99"';
    if (ua.includes('Safari') || ua.includes('iPhone')) return '"Safari";v="17", "Not;A Brand";v="99"';
    return '"Not;A Brand";v="99"';
  };

  const baseOrigin = 'https://www.ah.nl';

  const opts = (headers: any) => ({ headers, responseType: 'text' as const, timeout: 20000, maxRedirects: 5 });

  // Try multiple attempts with different realistic headers. We first fetch the homepage to collect cookies,
  // then request the product page with those cookies to look more like a browser session.
  const maxAttempts = 3;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const ua = choose(userAgents);
    const headers: Record<string, string> = {
      'User-Agent': ua,
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9,nl;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      Referer: baseOrigin,
      Connection: 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Dest': 'document',
      DNT: '1',
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
      'Sec-CH-UA': secCH(ua),
      'Sec-CH-UA-Mobile': ua.includes('Mobile') ? '?1' : '?0',
    };

    try {
      // small random delay to mimic human browsing
      await sleep(200 + Math.floor(Math.random() * 600));

      // fetch homepage to obtain cookies
      let cookieHeader = '';
      try {
        const home = await axios.get(baseOrigin + '/', opts(headers));
        const setCookie = home.headers['set-cookie'];
        if (setCookie) {
          if (Array.isArray(setCookie)) cookieHeader = setCookie.map((c) => c.split(';')[0]).join('; ');
          else cookieHeader = String(setCookie).split(';')[0];
        }
      } catch (e) {
        // ignore homepage fetch failures; continue and try product fetch anyway
      }

      // attach cookies if present
      if (cookieHeader) headers['Cookie'] = cookieHeader;

      const res = await axios.get(url, opts(headers));

      if (res.status === 200) {
        const html = String(res.data || '');
        return parsePriceFromHtml(html);
      }

      if (res.status === 403) {
        // Try a slightly different UA/headers on next attempt
        console.warn(`Attempt ${attempt + 1}: 403 for ${url} with UA ${ua}`);
        // small backoff
        await sleep(300 + Math.floor(Math.random() * 700));
        continue;
      }

      console.error(`Unexpected status ${res.status} fetching AH URL ${url}`);
      return null;
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 403) {
        console.warn(`Attempt ${attempt + 1}: received 403 for ${url}`);
        await sleep(300 + Math.floor(Math.random() * 700));
        continue;
      }

      console.error(`Error fetching AH URL ${url} on attempt ${attempt + 1}: ${String(e)}`);
      // try again unless exhausted
      await sleep(200 + Math.floor(Math.random() * 400));
    }
  }

  return null;
}

export default { parsePriceFromHtml, fetchPriceFromAhUrl };
