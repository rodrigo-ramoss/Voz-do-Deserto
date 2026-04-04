import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type AnyRecord = Record<string, unknown>;

function hasMensalTag(contact: unknown, tag: string): boolean {
  if (!contact || typeof contact !== "object") return false;
  const obj = contact as AnyRecord;
  const tags = obj.tags ?? obj.tag_names ?? obj.labels;
  if (!Array.isArray(tags)) return false;
  return tags.some((t) =>
    typeof t === "string"
      ? t.toLowerCase() === tag.toLowerCase()
      : typeof t === "object" &&
        t !== null &&
        (
          (t as AnyRecord).name?.toString().toLowerCase() === tag.toLowerCase() ||
          (t as AnyRecord).slug?.toString().toLowerCase() === tag.toLowerCase()
        )
  );
}

function extractContacts(payload: unknown): unknown[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (typeof payload !== "object") return [];
  const obj = payload as AnyRecord;
  for (const key of ["contacts", "data", "items", "results"]) {
    if (Array.isArray(obj[key])) return obj[key] as unknown[];
  }
  return [];
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
  const profileId = process.env.HOSTINGER_REACH_PROFILE_ID;
  const mensalTag = process.env.HOSTINGER_REACH_MONTHLY_TAG ?? "mensal";

  if (!token) {
    console.error("[plano-mensal] HOSTINGER_REACH_API_TOKEN não configurado");
    return NextResponse.json({ isMonthly: false, checked: false });
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    ...(profileId ? { "X-Profile-ID": profileId } : {}),
  };

  // Estratégia 1: buscar contato diretamente por e-mail e checar tag
  try {
    const contactUrl = new URL("https://developers.hostinger.com/api/reach/v1/contacts");
    contactUrl.searchParams.set("email", email);

    const contactRes = await fetch(contactUrl.toString(), {
      method: "GET",
      headers,
      cache: "no-store",
    });

    console.log(`[plano-mensal] Contatos endpoint status: ${contactRes.status}`);

    if (contactRes.ok) {
      const payload = await contactRes.json().catch(() => null);
      console.log("[plano-mensal] Contatos payload:", JSON.stringify(payload).slice(0, 300));
      const contacts = extractContacts(payload);
      // Se for um único objeto (não lista), trata como contato direto
      const contactList = contacts.length > 0 ? contacts : (payload ? [payload] : []);
      for (const c of contactList) {
        const cObj = c as AnyRecord;
        const contactEmail = (cObj.email ?? "").toString().trim().toLowerCase();
        if (contactEmail === email && hasMensalTag(c, mensalTag)) {
          return NextResponse.json({ isMonthly: true, checked: true });
        }
      }
      // Contato existe mas não tem tag mensal — nega acesso
      if (contactList.length > 0) {
        return NextResponse.json({ isMonthly: false, checked: true });
      }
    } else {
      const errBody = await contactRes.json().catch(() => ({}));
      console.error(`[plano-mensal] Erro contatos status=${contactRes.status}:`, JSON.stringify(errBody).slice(0, 200));
    }
  } catch (e) {
    console.error("[plano-mensal] Exceção contatos:", e);
  }

  // Estratégia 2: verificar segmento
  if (!segmentUuid) {
    console.error("[plano-mensal] HOSTINGER_REACH_MONTHLY_SEGMENT_UUID não configurado");
    return NextResponse.json({ isMonthly: false, checked: false });
  }

  try {
    const segUrl = new URL(
      `https://developers.hostinger.com/api/reach/v1/segmentation/segments/${segmentUuid}/contacts`
    );
    segUrl.searchParams.set("email", email);
    segUrl.searchParams.set("per_page", "1");

    const segRes = await fetch(segUrl.toString(), {
      method: "GET",
      headers,
      cache: "no-store",
    });

    console.log(`[plano-mensal] Segmento endpoint status: ${segRes.status}`);

    if (segRes.ok) {
      const payload = await segRes.json().catch(() => null);
      const contacts = extractContacts(payload);
      return NextResponse.json({ isMonthly: contacts.length > 0, checked: true });
    } else {
      const errBody = await segRes.json().catch(() => ({}));
      console.error(`[plano-mensal] Erro segmento status=${segRes.status}:`, JSON.stringify(errBody).slice(0, 200));
    }
  } catch (e) {
    console.error("[plano-mensal] Exceção segmento:", e);
  }

  return NextResponse.json({ isMonthly: false, checked: false });
}
