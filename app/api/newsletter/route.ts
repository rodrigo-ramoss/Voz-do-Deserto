import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const listId = Number(process.env.BREVO_LIST_ID ?? 2);

  if (!apiKey) {
    console.error("[newsletter] BREVO_API_KEY não configurada");
    return NextResponse.json({ error: "Serviço indisponível" }, { status: 500 });
  }

  const res = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      email,
      listIds: [listId],
      updateEnabled: true,
    }),
  });

  // 201 = criado, 204 = já existia e foi atualizado — ambos são sucesso
  if (res.status === 201 || res.status === 204) {
    return NextResponse.json({ ok: true });
  }

  const payload = await res.json().catch(() => ({}));
  console.error("[newsletter] Erro Brevo:", res.status, payload);
  return NextResponse.json({ error: "Erro ao cadastrar" }, { status: 500 });
}
