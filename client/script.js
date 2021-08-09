const button = document.querySelector("button");

const buyOrder = [
	{ id: 1, quantity: 3 },
	{ id: 2, quantity: 1 },
];

button.addEventListener("click", async () => {
	try {
		const res = await fetch(
			"http://localhost:3000/create-checkout-session",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					items: buyOrder,
				}),
			}
		);
		if (!res.ok) {
			throw new Error(
				`A ${res.status} error has occurred: ${res.statusText}`
			);
		}
		const { url } = await res.json();
		window.location = url;
	} catch (e) {
		console.error(e);
	}
});
