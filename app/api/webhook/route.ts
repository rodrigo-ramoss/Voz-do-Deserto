import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-02-24.acacia",
});

async function addSubscriberToReach(email: string): Promise<void> {
  const token = process.env.HOSTINGER_REACH_API_TOKEN;
  const tag = process.env.HOSTINGER_REACH_MONTHLY_TAG ?? "mensal";

  if (!token) {
    console.warn("[webhook] HOSTINGER_REACH_API_TOKEN não configurado.");
    return;
  }

  const res = await fetch("https://developers.hostinger.com/api/reach/v1/contacts", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, tags: [tag] }),
  });

  if (res.ok) {
    console.log("[webhook] Contato adicionado no Hostinger Reach:", email);
    return;
  }

  // Fallback sem tags
  const fallbackRes = await fetch("https://developers.hostinger.com/api/reach/v1/contacts", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });

  if (!fallbackRes.ok) {
    const err = await fallbackRes.json().catch(() => ({}));
    console.error("[webhook] Erro ao criar contato no Reach:", fallbackRes.status, err);
  } else {
    console.log("[webhook] Contato criado (sem tag) no Reach:", email);
  }
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET não configurado.");
    return NextResponse.json({ error: "Webhook não configurado." }, { status: 500 });
  }

  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("[webhook] Assinatura inválida:", err);
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;
        const email =
          session.customer_email ?? session.customer_details?.email ?? "";
        if (email) await addSubscriberToReach(email);
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        if (subscription.status !== "active") break;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;
        const customer = await stripe.customers.retrieve(customerId);
        if (customer.deleted) break;
        const email = (customer as Stripe.Customer).email ?? "";
        if (email) await addSubscriberToReach(email);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("[webhook] Erro ao processar evento:", event.type, err);
  }

  return NextResponse.json({ received: true });
}
