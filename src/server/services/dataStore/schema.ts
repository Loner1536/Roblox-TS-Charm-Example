import { t } from "@rbxts/t";

export default t.interface({
	totalClicks: t.number,
	currencies: t.strictInterface({
		money: t.number,
	}),
});
