import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).end()
  }

  const data = req.body

  let total = 0

  if (data.website) total += 500
  if (data.seo) total += 300
  if (data.ads) total += 400

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: data.email,

    line_items: [{
      price_data: {
        currency: "eur",
        product_data: {
          name: "Devis marketing digital personnalisé",
        },
        unit_amount: total * 100,
      },
      quantity: 1,
    }],

    success_url: "https://global-medias.eu/success",
    cancel_url: "https://global-medias.eu/cancel",
  })

  res.status(200).json({ url: session.url })
}