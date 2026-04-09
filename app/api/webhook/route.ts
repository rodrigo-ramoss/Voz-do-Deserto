import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-02-24.acacia",
});

// Lista Brevo: "Assinantes Arquivo Secreto" (ID 3)
const BREVO_PAID_LIST_ID = 3;

async function addSubscriberToBrevo(email: string, name?: string): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.warn("[webhook] BREVO_API_KEY não configurado.");
    return;
  }

  const body: Record<string, unknown> = {
    email,
    listIds: [BREVO_PAID_LIST_ID],
    updateEnabled: true,
  };

  if (name) {
    const parts = name.trim().split(" ");
    body.attributes = {
      FIRSTNAME: parts[0] ?? "",
      LASTNAME: parts.slice(1).join(" ") ?? "",
    };
  }

  const res = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (res.ok || res.status === 201 || res.status === 204) {
    console.log("[webhook] Assinante adicionado no Brevo (lista paga):", email);
  } else {
    const err = await res.json().catch(() => ({}));
    console.error("[webhook] Erro ao adicionar no Brevo:", res.status, err);
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
        const email = session.customer_email ?? session.customer_details?.email ?? "";
        const name = session.customer_details?.name ?? "";
        if (email) await addSubscriberToBrevo(email, name);
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
        const name = (customer as Stripe.Customer).name ?? "";
        if (email) await addSubscriberToBrevo(email, name);
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
