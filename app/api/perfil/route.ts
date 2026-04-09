import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-03-25.dahlia",
});

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "E-mail obrigatório" }, { status: 400 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Configuração ausente" }, { status: 500 });
  }

  try {
    const customers = await stripe.customers.list({ email, limit: 5 });

    if (customers.data.length === 0) {
      return NextResponse.json({ error: "Assinante não encontrado" }, { status: 404 });
    }

    const customer = customers.data[0];

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      limit: 10,
    });

    const active = subscriptions.data.find((s) => s.status === "active");
    const sub = active ?? subscriptions.data[0] ?? null;

    const interval = sub?.items?.data?.[0]?.price?.recurring?.interval ?? "month";

    return NextResponse.json({
      name: (customer as Stripe.Customer).name ?? "",
      email: (customer as Stripe.Customer).email ?? email,
      plan: sub
        ? {
            status: sub.status,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            currentPeriodEnd: sub.items?.data?.[0]?.current_period_end ?? null,
            interval,
          }
        : null,
    });
  } catch (err) {
    console.error("[perfil] Erro ao consultar Stripe:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
