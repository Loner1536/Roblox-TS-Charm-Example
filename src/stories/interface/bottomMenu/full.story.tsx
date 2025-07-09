// Packages
import { CreateVideStory, InferVideProps, Boolean } from "@rbxts/ui-labs";
import Vide from "@rbxts/vide";

// Interface
import { ForgeBottomMenu } from "@controllers/interface/lobby/bottomMenu";

import setup from "../../setup";

const controls = {
	visible: Boolean(true),
};

const story = CreateVideStory(
	{
		vide: Vide,
		controls,
	},
	(props: InferVideProps<typeof controls>) => {
		return setup(props, (interfaceProps) => {
			task.defer(interfaceProps.bottomMenu.visible, true);
			interfaceProps.bottomMenu.visible = props.controls.visible;
			return <ForgeBottomMenu props={interfaceProps} />;
		});
	},
);

export = story;
