import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type AnyRecord = Record<string, unknown>;

function extractContacts(payload: unknown): unknown[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (typeof payload !== "object") return [];
  const obj = payload as AnyRecord;
  const candidates = [obj.contacts, obj.data, obj.items, obj.results];
  for (const c of candidates) {
    if (Array.isArray(c)) return c;
  }
  return [];
}

function extractEmail(contact: unknown): string {
  if (!contact || typeof contact !== "object") return "";
  const obj = contact as AnyRecord;
  const val =
    obj.email ??
    obj.emailAddress ??
    obj.email_address ??
    obj.emailAddressString ??
    obj.address;
  if (typeof val !== "string") return "";
  return val.trim().toLowerCase();
}

function getNextPageUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as AnyRecord;
  const links =
    obj.links && typeof obj.links === "object" ? (obj.links as AnyRecord) : null;
  if (typeof links?.next === "string" && links.next.length > 0) return links.next;
  const meta =
    obj.meta && typeof obj.meta === "object" ? (obj.meta as AnyRecord) : null;
  const pagination =
    meta?.pagination && typeof meta.pagination === "object"
      ? (meta.pagination as AnyRecord)
      : obj.pagination && typeof obj.pagination === "object"
        ? (obj.pagination as AnyRecord)
        : null;
  if (typeof pagination?.next_page_url === "string") return pagination.next_page_url;
  return null;
}

export async function POST(req: NextRequest) {
  let email: string;

  try {
    const body = await req.json();
    email = (body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
  }

  const token = process.env.HOSTINGER_REACH_API_TOKEN;
  const segmentUuid = process.env.HOSTINGER_REACH_MONTHLY_SEGMENT_UUID;
  const maxPages = Math.min(
    Number(process.env.HOSTINGER_REACH_MONTHLY_MAX_PAGES ?? "50"),
    200
  );

  if (!token || !segmentUuid) {
    return NextResponse.json({ isMonthly: false, checked: false });
  }

  // Estratégia 1: busca direta por e-mail no segmento
  const directUrl = new URL(
    `https://developers.hostinger.com/api/reach/v1/segmentation/segments/${segmentUuid}/contacts`
  );
  directUrl.searchParams.set("email", email);
  directUrl.searchParams.set("per_page", "1");

  try {
    const directRes = await fetch(directUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (directRes.ok) {
      const payload = await directRes.json().catch(() => null);
      const contacts = extractContacts(payload);
      if (contacts.length > 0) {
        return NextResponse.json({ isMonthly: true, checked: true });
      }
      return NextResponse.json({ isMonthly: false, checked: true });
    }
  } catch {
    // Fallback para paginação manual
  }

  // Estratégia 2: paginação manual
  let nextUrl: string | null =
    `https://developers.hostinger.com/api/reach/v1/segmentation/segments/${segmentUuid}/contacts?page=1`;

  for (let page = 1; page <= maxPages && nextUrl; page++) {
    const res = await fetch(nextUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error("[plano-mensal] Erro Hostinger Reach:", res.status, body);
      return NextResponse.json({ isMonthly: false, checked: false });
    }

    const payload = await res.json().catch(() => null);
    const contacts = extractContacts(payload);

    for (const contact of contacts) {
      if (extractEmail(contact) === email) {
        return NextResponse.json({ isMonthly: true, checked: true });
      }
    }

    nextUrl = getNextPageUrl(payload);
    if (!nextUrl && contacts.length === 0) break;
  }

  return NextResponse.json({ isMonthly: false, checked: true });
}
