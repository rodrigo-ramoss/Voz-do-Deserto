import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Lista Brevo: "Newsletter Gratuita" (ID 4)
const BREVO_FREE_LIST_ID = 4;

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

  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.error("[newsletter] BREVO_API_KEY não configurado");
    return NextResponse.json({ error: "Serviço indisponível" }, { status: 500 });
  }

  const res = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      email,
      listIds: [BREVO_FREE_LIST_ID],
      updateEnabled: true,
    }),
  });

  if (res.ok || res.status === 201 || res.status === 204) {
    console.log("[newsletter] Contato adicionado no Brevo (lista gratuita):", email);
    return NextResponse.json({ ok: true });
  }

  const payload = await res.json().catch(() => ({}));
  console.error("[newsletter] Erro Brevo:", res.status, payload);
  return NextResponse.json({ error: "Erro ao cadastrar" }, { status: 500 });
}
