// Services
import { Players, StarterGui, Workspace } from "@rbxts/services";

// Packages
import { Controller, OnStart } from "@flamework/core";
import Vide from "@rbxts/vide";

// Utility
import px from "shared/utility/px";

// Dependencies
import playerData from "./playerData";
import interfaceProps from "./props";
import { ForgeLobby } from "./lobby";

// Player Info
const player = Players.LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui");

const { mount } = Vide;

@Controller({
	loadOrder: 1,
})
export class Interface implements OnStart {
	onStart() {
		mount(
			() => {
				px.setTarget(Workspace.CurrentCamera!);

				interfaceProps.playerData = {
					totalClicks: playerData.totalClicks(player),
					currencies: playerData.currencies(player),
				};

				task.defer(interfaceProps.bottomMenu.visible, true);

				return <ForgeLobby props={interfaceProps} />;
			},
			(<screengui Name={"Lobby"} IgnoreGuiInset={true} ResetOnSpawn={false} Parent={playerGui} />) as ScreenGui,
		);

		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false);
	}
}
