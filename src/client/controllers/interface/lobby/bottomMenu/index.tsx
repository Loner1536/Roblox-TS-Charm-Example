// Packages
import Vide from "@rbxts/vide";

// Types
import type * as Types from "@shared/types";

// Dependencies
import { BottomMenuContainer } from "@shared/interface/buttonMenu";

export function ForgeBottomMenu({ props }: { props: Types.InterfaceProps.default }) {
	return (
		<>
			<BottomMenuContainer props={props} />
		</>
	);
}
