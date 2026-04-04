import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-03-31.basil",
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_MONTHLY_PRICE_ID;

  if (!secretKey || !priceId) {
    console.error("[checkout] Variáveis de ambiente do Stripe não configuradas.");
    return NextResponse.json(
      { error: "Pagamento temporariamente indisponível." },
      { status: 503 }
    );
  }

  let email: string;
  let returnSlug: string;

  try {
    const body = await req.json();
    email = (body.email ?? "").trim().toLowerCase();
    returnSlug = (body.slug ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  if (email && !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://rodrigoramosvd.com";

  const successUrl = returnSlug
    ? `${baseUrl}/livraria/scriptorium/${returnSlug}?plan=mensal&session_id={CHECKOUT_SESSION_ID}`
    : `${baseUrl}/livraria?plan=mensal&session_id={CHECKOUT_SESSION_ID}`;

  const cancelUrl = returnSlug
    ? `${baseUrl}/livraria/scriptorium/${returnSlug}`
    : `${baseUrl}/livraria`;

  try {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      ...(email ? { customer_email: email } : {}),
      metadata: {
        source: "scriptorium",
        ...(returnSlug ? { slug: returnSlug } : {}),
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] Erro ao criar sessão Stripe:", err);
    return NextResponse.json(
      { error: "Não foi possível iniciar o pagamento." },
      { status: 500 }
    );
  }
}
