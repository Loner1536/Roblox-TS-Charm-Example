// Types
import type { PlayerData } from "shared/atoms/dataStore";
import type { PlayerStore } from "@rbxts/lyra";
import type { Atoms } from "@network/server";

export default function (
	player: Player,
	store: PlayerStore<PlayerData>,
	transformFunction: (data: PlayerData) => void,
) {
	let errorTag: string | undefined;

	const success = store.updateAsync(player, (data) => {
		if (data.totalClicks <= 10) {
			errorTag = "Requirement";
			return false;
		}

		data.currencies.money += 10;
		if (transformFunction) transformFunction(data);
		return true;
	});

	if (!success) {
		if (errorTag === "Requirement") {
			warn("⚠️ Not enough total clicks");
		} else {
			warn("⚠️ Unknown error:");
		}
	}
}
