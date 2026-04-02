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

function hasMorePages(payload: unknown, page: number, contactsCount: number): boolean {
  if (!payload || typeof payload !== "object") return contactsCount > 0;
  const obj = payload as AnyRecord;

  const meta = obj.meta && typeof obj.meta === "object" ? (obj.meta as AnyRecord) : null;
  const pagination =
    meta?.pagination && typeof meta.pagination === "object"
      ? (meta.pagination as AnyRecord)
      : obj.pagination && typeof obj.pagination === "object"
        ? (obj.pagination as AnyRecord)
        : null;

  const totalPages =
    (typeof pagination?.total_pages === "number" ? pagination.total_pages : undefined) ??
    (typeof pagination?.totalPages === "number" ? pagination.totalPages : undefined) ??
    (typeof meta?.total_pages === "number" ? meta.total_pages : undefined) ??
    (typeof meta?.totalPages === "number" ? meta.totalPages : undefined);

  if (typeof totalPages === "number" && Number.isFinite(totalPages)) {
    return page < totalPages;
  }

  const links = obj.links && typeof obj.links === "object" ? (obj.links as AnyRecord) : null;
  if (typeof links?.next === "string" && links.next.length > 0) return true;

  return contactsCount > 0;
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
  const monthlyGroupUuid = process.env.HOSTINGER_REACH_MONTHLY_GROUP_UUID;
  const maxPages = Number(process.env.HOSTINGER_REACH_MONTHLY_MAX_PAGES ?? "20");

  if (!token || !monthlyGroupUuid) {
    return NextResponse.json({ isMonthly: false, checked: false });
  }

  const safeMaxPages = Number.isFinite(maxPages) && maxPages > 0 ? Math.min(maxPages, 200) : 20;

  for (let page = 1; page <= safeMaxPages; page++) {
    const url = new URL("https://developers.hostinger.com/api/reach/v1/contacts");
    url.searchParams.set("group_uuid", monthlyGroupUuid);
    url.searchParams.set("page", String(page));

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      console.error("[plano-mensal] Erro Hostinger Reach:", res.status, payload);
      return NextResponse.json({ isMonthly: false, checked: false });
    }

    const payload = await res.json().catch(() => null);
    const contacts = extractContacts(payload);

    for (const contact of contacts) {
      if (extractEmail(contact) === email) {
        return NextResponse.json({ isMonthly: true, checked: true });
      }
    }

    if (!hasMorePages(payload, page, contacts.length)) break;
  }

  return NextResponse.json({ isMonthly: false, checked: true });
}

