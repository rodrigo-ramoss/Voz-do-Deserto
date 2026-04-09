import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-03-25.dahlia",
});

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

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("[plano-mensal] STRIPE_SECRET_KEY não configurado");
    return NextResponse.json({ isMonthly: false, checked: false });
  }

  try {
    // Busca clientes no Stripe pelo email
    const customers = await stripe.customers.list({ email, limit: 5 });

    if (customers.data.length === 0) {
      console.log(`[plano-mensal] Nenhum cliente Stripe encontrado para: ${email}`);
      return NextResponse.json({ isMonthly: false, checked: true });
    }

    // Verifica se algum cliente tem assinatura ativa
    for (const customer of customers.data) {
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: "active",
        limit: 5,
      });

      if (subscriptions.data.length > 0) {
        console.log(`[plano-mensal] Assinatura ativa encontrada para: ${email} (cliente: ${customer.id})`);
        return NextResponse.json({ isMonthly: true, checked: true });
      }
    }

    console.log(`[plano-mensal] Cliente existe no Stripe mas sem assinatura ativa: ${email}`);
    return NextResponse.json({ isMonthly: false, checked: true });

  } catch (err) {
    console.error("[plano-mensal] Erro ao consultar Stripe:", err);
    return NextResponse.json({ isMonthly: false, checked: false });
  }
}
