import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Billing not configured" },
      { status: 503 }
    );
  }
  try {
    const stripe = new Stripe(secretKey);
    const { data: customers } = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });
    let customerId = customers[0]?.id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;
    }
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: new URL("/dashboard", request.url).toString(),
    });
    if (session.url) {
      return NextResponse.json({ url: session.url });
    }
  } catch (err) {
    console.error("Stripe portal error:", err);
  }
  return NextResponse.json(
    { error: "Could not open billing portal" },
    { status: 502 }
  );
}
