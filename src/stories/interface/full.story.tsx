// Packages
import { CreateVideStory, InferVideProps } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";

// Interface
import { ForgeLobby } from "client/controllers/interface/lobby";

import setup from "../setup";

const controls = {};

const story = CreateVideStory(
	{
		vide: Vide,
		controls,
	},
	(props: InferVideProps<typeof controls>) => {
		return setup(props, (interfaceProps) => {
			return <ForgeLobby props={interfaceProps} />;
		});
	},
);

export = story;
