export type * as Currencies from "./currencies";

import type { Atom } from "@rbxts/charm";

import type Currencies from "./currencies";

export default interface PlayerDataTypes {
	currencies: Atom<Currencies>;
}
