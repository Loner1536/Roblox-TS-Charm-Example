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
		data.currencies.money += 1;
		if (transformFunction) transformFunction(data);
		return true;
	});

	if (!success) {
		warn("⚠️ Unknown error:");
	}
}
