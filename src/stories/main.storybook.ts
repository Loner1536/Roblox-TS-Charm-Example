import { Storybook } from "@rbxts/ui-labs";

const storybook: Storybook = {
	name: "interface",
	storyRoots: [script.Parent!.FindFirstChild("interface")! as Folder],
};

export = storybook;
