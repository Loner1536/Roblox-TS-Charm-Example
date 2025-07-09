// Packages
import ServerNetwork from "@network/server";

// Types
import type { PlayerData } from "shared/atoms/dataStore";
import type { SyncPayload } from "@rbxts/charm-sync";

// Atoms
import { GlobalAtoms } from "..";

export function filterPayload(player: Player, payload: SyncPayload<GlobalAtoms>) {
	if (payload.type === "init") {
		return {
			...payload,
			data: {
				...payload.data,
				players: new Map([[tostring(player.UserId), payload.data.players.get(tostring(player.UserId))]]),
			},
		};
	}

	return {
		...payload,
		data: {
			...payload.data,
			players:
				payload.data.players &&
				new Map([[tostring(player.UserId), payload.data.players.get(tostring(player.UserId))]]),
		},
	};
}
