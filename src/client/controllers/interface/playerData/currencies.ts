// Packages
import { useAtom } from "@rbxts/vide-charm";

// Charm Components
import { getPlayerData } from "shared/atoms/dataStore";

export default function (player: Player) {
	return useAtom(() => {
		const data = getPlayerData(player.UserId);
		return data
			? data.currencies
			: {
					money: 0,
				};
	});
}
