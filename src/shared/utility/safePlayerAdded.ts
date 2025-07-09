import { Players } from "@rbxts/services";

export function safePlayerAdded(onPlayerAddedCallback: (player: Player) => void): RBXScriptConnection {
	Players.GetPlayers().forEach((player) => task.spawn(() => onPlayerAddedCallback(player)));
	return Players.PlayerAdded.Connect(onPlayerAddedCallback);
}
