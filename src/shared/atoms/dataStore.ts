// Packages
import ServerNetwork from "@network/server";
import Charm from "@rbxts/charm";

// Types
import type * as Types from "shared/types";

// Charm Components
const { atom } = Charm;

export type PlayerData = ServerNetwork.DataStore.Player.Default;

type PlayerDataMap = ServerNetwork.Atoms.PlayerMap;

export const datastore = {
	players: atom<PlayerDataMap>(new Map()),
};

// *KEEP* Used For Replication
export function getPlayerData(id: number) {
	return datastore.players().get(tostring(id));
}
