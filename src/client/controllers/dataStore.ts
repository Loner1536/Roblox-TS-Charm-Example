// Packages
import { Controller, OnStart } from "@flamework/core";
import ClientNetwork from "@network/client";
import CharmSync from "@rbxts/charm-sync";

// Charm Components
const { client } = CharmSync;

import atoms from "shared/atoms";

const syncer = client({ atoms });

@Controller()
export class Interface implements OnStart {
	onStart() {
		ClientNetwork.Atoms.sync.on((payload) => {
			syncer.sync(payload as never);
		});
		ClientNetwork.Atoms.init.fire();
	}
}
