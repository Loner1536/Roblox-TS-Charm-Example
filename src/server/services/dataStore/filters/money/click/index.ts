// Types
import type { PlayerData } from "shared/atoms/dataStore";
import type { PlayerStore } from "@rbxts/lyra";
import type { Atoms } from "@network/server";

// Dependencies
import types from "./types";

export default (
	player: Player,
	store: PlayerStore<PlayerData>,
	actionData: Extract<Atoms.MoneyUnion, { type: "click" }>,
) =>
	types[actionData.value](player, store, (data) => {
		data.totalClicks += 1;
	});
