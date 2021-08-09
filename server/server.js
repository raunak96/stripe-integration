import express, { json } from "express";
import { config } from "dotenv";
import Stripe from "stripe";
import cors from "cors";

config();

const app = express();
app.use(json());

/* When client was in same url as server, it was in public folder inside server folder */
// app.use(express.static("public"));

/* Since client and server now in different origin, we use cors */
app.use(
	cors({
		origin: process.env.CLIENT_ORIGIN,
	})
);

const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);

const storeItems = new Map([
	[1, { priceInPaisa: 100000, name: "Learn React Today" }],
	[2, { priceInPaisa: 50000, name: "Learn CSS Today" }],
]);

app.post("/create-checkout-session", async (req, res) => {
	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			mode: "payment",
			line_items: req.body.items.map(item => {
				const storeItem = storeItems.get(item.id);
				return {
					price_data: {
						currency: "inr",
						product_data: {
							name: storeItem.name,
						},
						unit_amount: storeItem.priceInPaisa,
					},
					quantity: item.quantity,
				};
			}),
			success_url: `${process.env.CLIENT_URL}/success.html`,
			cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
		});
		res.json({ url: session.url });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.listen(3000, error => {
	if (error) throw error;
	console.log(`Server started at port 3000`);
});
