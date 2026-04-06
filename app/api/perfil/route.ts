import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-02-24.acacia",
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
      status: "all",
      limit: 5,
      expand: ["data.items.data.price.product"],
    });

    const active = subscriptions.data.find((s) => s.status === "active");
    const sub = active ?? subscriptions.data[0] ?? null;

    return NextResponse.json({
      name: (customer as Stripe.Customer).name ?? "",
      email: (customer as Stripe.Customer).email ?? email,
      plan: sub
        ? {
            status: sub.status,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            currentPeriodEnd: sub.current_period_end,
            interval:
              (sub.items.data[0]?.price as Stripe.Price)?.recurring?.interval ?? "month",
          }
        : null,
    });
  } catch (err) {
    console.error("[perfil] Erro ao consultar Stripe:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
