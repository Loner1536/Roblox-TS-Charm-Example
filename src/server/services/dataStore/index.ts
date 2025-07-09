// Services
import { Players, RunService } from "@rbxts/services";

// Packages
import { MockDataStoreService, MockMemoryStoreService, createPlayerStore } from "@rbxts/lyra";
import { Service, OnInit } from "@flamework/core";
import Network from "@network/server";

// Types
import type { PlayerData } from "shared/atoms/dataStore";

// Utility
import { safePlayerAdded } from "shared/utility/safePlayerAdded";

// Dependencies
import template from "./template";
import filters from "./filters";
import schema from "./schema";

@Service()
export class DataStore implements OnInit {
	private playersSendingInitialData = new Set<Player>();
	private playersSentInitialData = new Set<Player>();
	private playersRequestedInit = new Set<Player>();

	private store = createPlayerStore<PlayerData>({
		name: "PlayerData",
		template: template,
		schema: schema as any,
		dataStoreService: new MockDataStoreService(),
		memoryStoreService: new MockMemoryStoreService(),
		changedCallbacks: [
			(key: string, newData: PlayerData, oldData?: PlayerData) => {
				this.syncPlayerDataWithClient(key, newData);
			},
		],
		logCallback: this.createLogger(),

		// Add migration steps if needed
		/**
		 * Example of how to add Lyra migrations when needed:
		 *
		 * migrationSteps: [
		 *     Lyra.MigrationStep.addFields("addGems", { gems: 0 }),
		 *     Lyra.MigrationStep.transform("renameInventory", (data) => {
		 *         data.items = data.inventory;
		 *         data.inventory = undefined;
		 *         return data;
		 *     }),
		 * ],
		 *
		 * importLegacyData: (key: string) => {
		 *     // Import data from old DataStore if needed
		 *     return undefined; // or legacy data
		 * },
		 */

		// Legacy data import if needed
		// importLegacyData: (key: string) => { /* ... */ },
	});

	public getPlayerStore() {
		return this.store;
	}

	onInit(): void {
		this.setupNetworking();

		safePlayerAdded((player) => {
			try {
				this.store.loadAsync(player);
				Promise.fromEvent(Players.PlayerRemoving, (left) => player === left).then(() => {
					this.playersSendingInitialData.delete(player);
					this.playersSentInitialData.delete(player);
					this.playersRequestedInit.delete(player);

					this.store.unloadAsync(player);
				});
				this.tryToSendInitialData(player);
			} catch (error) {
				this.handlePlayerDataError(player, error);
			}
		});

		game.BindToClose(() => {
			this.store.closeAsync();
		});
	}
	private handlePlayerDataError(player: Player, err: unknown) {
		const errorMessage = typeIs(err, "string") === true ? err : tostring(err);
		warn(`Failed to load document for player ${player.Name}: ${errorMessage}`);
		player.Kick(`Your data failed to load. Please rejoin the game.\n\nError: ${errorMessage}`);
	}
	private createLogger() {
		if (RunService.IsStudio() === true) {
			return (message: { level: string; message: string; context?: unknown }) => {
				print(`[Lyra][${message.level}] ${message.message}`);
				if (message.context !== undefined) {
					print("Context:", message.context);
				}
			};
		} else {
			return (message: { level: string; message: string; context?: unknown }) => {
				if (message.level === "error" || message.level === "fatal") {
					warn(`[Lyra] ${message.message}`);
				}
			};
		}
	}
	// DataStore Atom Sync
	private setupNetworking(): void {
		Network.Atoms.init.on((player: Player) => {
			this.playersRequestedInit.add(player);
			task.spawn(() => {
				this.tryToSendInitialData(player);
			});
		});
	}
	private syncPlayerDataWithClient(key: string, newData: PlayerData): void {
		try {
			const userId = tonumber(key);
			if (userId === undefined) {
				warn(`[DataStore] Invalid userId from key: ${key}`);
				return;
			}

			const player = Players.GetPlayerByUserId(userId);
			if (player === undefined || !this.playersSentInitialData.has(player)) {
				return;
			}

			const playersMap = new Map<string, unknown>();
			playersMap.set(tostring(player.UserId), newData);

			Network.Atoms.sync.fire(player, {
				type: "patch",
				data: { players: playersMap },
			} as Parameters<typeof Network.Atoms.sync.fire>[1]);
		} catch (error) {
			warn(`[DataStore] Error syncing player data: ${error}`);
		}
	}
	private async sendInitialPlayerData(player: Player): Promise<void> {
		try {
			const playerData = await this.store.get(player);
			const playersMap = new Map<string, unknown>();
			playersMap.set(tostring(player.UserId), playerData);

			Network.Atoms.sync.fire(player, {
				type: "init",
				data: { players: playersMap },
			} as Parameters<typeof Network.Atoms.sync.fire>[1]);

			this.playersSentInitialData.add(player);
			Network.Atoms.update.on((player, payload) => {
				const [success, err] = pcall(() =>
					filters[payload.type][payload.action.type](player, this.store, payload.action as never),
				);
				if (!success)
					error(
						`Problem with updating playerData Category: ${payload.type} and Action: ${payload.action.type} ActionContains:` +
							payload.action,
					);
			});
		} catch (error) {
			warn(`[DataStore] Failed to send initial data for ${player.Name}: ${error}`);
		}
	}
	private async tryToSendInitialData(player: Player): Promise<void> {
		if (
			this.playersRequestedInit.has(player) !== true ||
			this.playersSentInitialData.has(player) === true ||
			this.playersSendingInitialData.has(player) === true
		) {
			return;
		}

		try {
			this.playersSendingInitialData.add(player);

			const playerData = await this.store.get(player);
			await this.sendInitialPlayerData(player);
		} catch (error) {
			print(`[DataStore] Player data not ready yet for ${player.Name}, will send when loaded`);
		} finally {
			this.playersSendingInitialData.delete(player);
		}
	}
}
