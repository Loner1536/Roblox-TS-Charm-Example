// Types
export type * as PlayerData from "./playerData";
export type * as BottomMenu from "./bottomMenu";

export type * as Network from "@network/client";
import type Network from "@network/client";

import type PlayerData from "./playerData";
import type BottomMenu from "./bottomMenu";

export default interface InterfaceProps {
	bottomMenu: BottomMenu;
	playerData: PlayerData;
	network: {
		update: {
			fire: (payload: Network.Atoms.CategoryPayload) => void;
		};
	};
}
