import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID_PRO;
  if (!priceId || !secretKey) {
    return NextResponse.redirect(
      new URL("/pricing?error=config", request.url)
    );
  }

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: new URL("/dashboard", request.url).toString(),
      cancel_url: new URL("/pricing", request.url).toString(),
      customer_email: user.email,
      metadata: { user_id: user.id },
    });
    if (session.url) {
      return NextResponse.redirect(session.url, 303);
    }
  } catch (err) {
    console.error("Stripe checkout error:", err);
  }
  return NextResponse.redirect(new URL("/pricing?error=checkout", request.url), 303);
}
