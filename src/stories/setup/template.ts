// Types
import type { PlayerData } from "shared/atoms/dataStore";

const defaultData: PlayerData = {
	totalClicks: 0,
	currencies: {
		money: 0,
	},
} as PlayerData;

export default defaultData as PlayerData;
