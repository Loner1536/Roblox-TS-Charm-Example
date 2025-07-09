// Packages
import Vide from "@rbxts/vide";

// Types
import type * as Types from "shared/types";

// Components
import { ForgeBottomMenu } from "./bottomMenu";

export function ForgeLobby({ props }: { props: Types.InterfaceProps.default }) {
	return (
		<>
			<ForgeBottomMenu props={props} />
		</>
	);
}
