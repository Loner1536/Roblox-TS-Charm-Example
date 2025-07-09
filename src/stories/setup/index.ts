// Packages
import CharmSync from "@rbxts/charm-sync";
import Network from "@network/server";

// Types
import type { InferVideProps } from "@rbxts/ui-labs";
import type { PlayerStore } from "@rbxts/lyra";

// Types
import type * as Types from "shared/types";

// Utility
import px from "shared/utility/px";

// Ingame Components
import interfaceProps from "client/controllers/interface/props";

// Dependencies
import currencies from "client/controllers/interface/playerData/currencies";
import totalClicks from "@controllers/interface/playerData/totalClicks";
import filters from "server/services/dataStore/filters";
import template from "./template";

// Components
import atoms from "shared/atoms";

const syncer = CharmSync.client({ atoms });

export default function (props: InferVideProps<{}>, callback: (interfaceProps: Types.InterfaceProps.default) => void) {
	px.setTarget(props.target);

	const mockedPlayer = {
		Name: "UI-Labs",
		UserId: math.random(1, 1000000000),
	} as unknown as Player;

	const playerData = table.clone(template);

	interfaceProps.playerData = {
		totalClicks: totalClicks(mockedPlayer),
		currencies: currencies(mockedPlayer),
	};

	const playersMap = new Map<string, unknown>();
	playersMap.set(tostring(mockedPlayer.UserId), playerData);

	const payload = {
		type: "init",
		data: { players: playersMap },
	} as Parameters<typeof Network.Atoms.sync.fire>[1];
	syncer.sync(payload as never);

	const mockedStore = {
		updateAsync: (
			_: unknown,
			player: Player,
			transformFunction: (data: Network.DataStore.Player.Default) => boolean,
		): boolean => {
			let success = false;

			if (transformFunction(playerData)) {
				success = true;

				const playersMap = new Map<string, unknown>();
				playersMap.set(tostring(mockedPlayer.UserId), playerData);

				const payload = {
					type: "patch",
					data: { players: playersMap },
				} as Parameters<typeof Network.Atoms.sync.fire>[1];
				syncer.sync(payload as never);
			}

			return success;
		},
	} as unknown as PlayerStore<Network.DataStore.Player.Default>;

	interfaceProps.network = {
		update: {
			fire: (payload: Network.Atoms.CategoryPayload) => {
				const [success, err] = pcall(() => {
					filters[payload.type][payload.action.type](mockedPlayer, mockedStore, payload.action as any);
				});
				if (!success)
					error(
						`Problem with updating playerData Category: ${payload.type} and Action: ${payload.action.type} error: ${err}`,
					);
			},
		},
	};

	return callback(interfaceProps);
}
