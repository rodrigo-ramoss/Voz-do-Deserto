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

  const token = process.env.HOSTINGER_REACH_API_TOKEN;
  const profileId = process.env.HOSTINGER_REACH_PROFILE_ID;

  if (!token || !profileId) {
    console.error("[newsletter] HOSTINGER_REACH_API_TOKEN ou HOSTINGER_REACH_PROFILE_ID não configurados");
    return NextResponse.json({ error: "Serviço indisponível" }, { status: 500 });
  }

  const res = await fetch(`https://developers.hostinger.com/api/reach/v1/profiles/${profileId}/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      email,
    }),
  });

  if (res.ok || res.status === 201 || res.status === 204) {
    return NextResponse.json({ ok: true });
  }

  const payload = await res.json().catch(() => ({}));
  console.error("[newsletter] Erro Hostinger Reach:", res.status, payload);
  return NextResponse.json({ error: "Erro ao cadastrar" }, { status: 500 });
}
