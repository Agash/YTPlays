// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron/renderer";
import { IPC } from "../shared/ipc-commands";
import { ChatMessage, Mode, QueueStatistics } from "../shared/types";
import { ConfigState } from "./slices/configSlice";

const queueAPI = {
    onUpdateCommandStats: (callback: (stats: QueueStatistics) => void) =>
        ipcRenderer.on(IPC.QUEUE.COMMAND_STATISTICS.UPDATE, (_event, value) =>
            callback(value)
        ),
    onUpdateUserStats: (callback: (stats: QueueStatistics) => void) =>
        ipcRenderer.on(IPC.QUEUE.USER_STATISTICS.UPDATE, (_event, value) =>
            callback(value)
        ),
};

const handlerAPI = {
    onExecutedCommand: (callback: (message: ChatMessage) => void) =>
        ipcRenderer.on(IPC.HANDLER.EXECUTED_COMMAND, (_event, value) =>
            callback(value)
        ),
    onMonarchChanged: (callback: (username: string) => void) =>
        ipcRenderer.on(IPC.HANDLER.MONARCHY.CHANGED_MONARCH, (_event, value) =>
            callback(value)
        ),
    onEligibleUsersUpdated: (callback: (usernames: string[]) => void) =>
        ipcRenderer.on(
            IPC.HANDLER.MONARCHY.UPDATE_ELIGIBLE_USERS,
            (_event, value) => callback(value)
        ),
};

const mainAPI = {
    onConfig: (callback: (config: ConfigState) => void) => {
        const subscription = (_: Electron.IpcRendererEvent, config: ConfigState) =>
            callback(config);
        ipcRenderer.on(IPC.MAIN.CONFIG, subscription);

        return () => {
            ipcRenderer.removeListener(IPC.MAIN.CONFIG, subscription);
        };
    },
    getConfig: () => ipcRenderer.send(IPC.MAIN.GET_CONFIG),
    setConfig: (config: ConfigState) =>
        ipcRenderer.send(IPC.MAIN.SET_CONFIG, config),
    startRun: () => ipcRenderer.send(IPC.MAIN.START),
    stopRun: () => ipcRenderer.send(IPC.MAIN.STOP),
    openShowdownWindow: () => ipcRenderer.send(IPC.MAIN.OPEN_SHOWDOWN),
    closeShowdownWindow: () => ipcRenderer.send(IPC.MAIN.CLOSE_SHOWDOWN),
};

const showdownAPI = {
    // --- Utility Functions ---
    clickElement: async (selector: any) => {
        try {
            document.querySelector(selector)?.click(); // Use optional chaining to avoid errors if element not found
            return true;
        } catch (error) {
            console.error(`Error clicking element with selector ${selector}:`, error);
            return false;
        }
    },
    typeIntoElement: async (selector: any, text: string) => {
        try {
            const element = document.querySelector(selector);
            if (element) { // Check if element exists
                element.value = text;
                element.dispatchEvent(new Event('input', { bubbles: true }));
                return true;
            } else {
                console.error(`Element with selector ${selector} not found for typing.`);
                return false;
            }
        } catch (error) {
            console.error(`Error typing into element with selector ${selector}:`, error);
            return false;
        }
    },
    getElementProperty: async (selector: any, property: string) => {
        try {
            const element = document.querySelector(selector);
            return element ? element[property] : null; // Return null if element not found
        } catch (error) {
            console.error(`Error getting property ${property} of element with selector ${selector}:`, error);
            return null;
        }
    },
    getElementDataset: async (selector: any) => {
        try {
            const element = document.querySelector(selector);
            return element ? element.dataset : null; // Return null if element not found
        } catch (error) {
            console.error(`Error getting dataset of element with selector ${selector}:`, error);
            return null;
        }
    },
    getElementTextContent: async (selector: any) => {
        try {
            const element = document.querySelector(selector);
            return element ? element.textContent : null;
        } catch (error) {
            console.error(`Error getting text content of element with selector ${selector}:`, error);
            return null;
        }
    },
    waitForSelector: async (selector: any, timeout = 30000) => { // Default timeout of 5 seconds
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkInterval = setInterval(() => {
                if (document.querySelector(selector)) {
                    clearInterval(checkInterval);
                    resolve(true);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(checkInterval);
                    reject(new Error(`Timeout waiting for selector: ${selector}`));
                }
            }, 100); // Check every 100ms
        });
    },


    // --- Pokemon Showdown Specific API Functions ---

    /**
     * Logs in as a guest user.
     */
    loginAsGuest: async () => {
        console.log('showdownAPI: loginAsGuest called');
        try {
            await showdownAPI.clickElement('button[name="login"]'); // Click "Login" button
            await showdownAPI.waitForSelector('button[name="guest"]'); // Wait for guest button to appear
            await showdownAPI.clickElement('button[name="guest"]'); // Click "Play as Guest"
            return true;
        } catch (error) {
            console.error('showdownAPI: Error in loginAsGuest:', error);
            return false;
        }
    },

    /**
     * Enters a username. Should be called after clicking 'Play as Guest'.
     * @param {string} username The desired username.
     */
    enterUsername: async (username: string) => {
        console.log('showdownAPI: enterUsername called with:', username);
        try {
            await showdownAPI.waitForSelector('input[name="username"]'); // Wait for username input
            await showdownAPI.typeIntoElement('input[name="username"]', username); // Type username
            await showdownAPI.clickElement('button[type="submit"]'); // Click "Choose Name" button
            return true;
        } catch (error) {
            console.error('showdownAPI: Error in enterUsername:', error);
            return false;
        }
    },

    /**
     * Goes to the battle lobby.
     */
    goToLobby: async () => {
        console.log('showdownAPI: goToLobby called');
        try {
            await showdownAPI.clickElement('button[value="Battle"]'); // Click "Battle" in main menu
            return true;
        } catch (error) {
            console.error('showdownAPI: Error in goToLobby:', error);
            return false;
        }
    },

    /**
     * Chooses a battle format in the lobby.
     * @param {string} formatName The name of the format (e.g., "Random Battle").
     */
    chooseBattleFormat: async (formatName: string) => {
        console.log('showdownAPI: chooseBattleFormat called with:', formatName);
        try {
            const formatSelector = `.format-button[data-formatid="${formatName.toLowerCase().replace(/ /g, '')}"]`; // Create selector dynamically
            await showdownAPI.waitForSelector(formatSelector); // Wait for format button
            await showdownAPI.clickElement(formatSelector); // Click the format button
            return true;
        } catch (error) {
            console.error('showdownAPI: Error in chooseBattleFormat:', error);
            return false;
        }
    },

    /**
     * Starts searching for a battle (in the chosen format).
     */
    startBattleSearch: async () => {
        console.log('showdownAPI: startBattleSearch called');
        try {
            await showdownAPI.clickElement('button[name="search"]'); // Click "Search" button
            return true;
        } catch (error) {
            console.error('showdownAPI: Error in startBattleSearch:', error);
            return false;
        }
    },


    waitForActions: async (timeout: number = 30000, interval: number = 100) => {
        return new Promise<Array<"move" | "switch">>((resolve, reject) => {
            const startTime = Date.now();
            const checkInterval = setInterval(() => {
                const actions: Array<"move" | "switch"> = [];

                const switchButton = document.querySelector('.switchmenu button:nth-child(1)');
                const moveButton = document.querySelector('.movemenu button:nth-child(1)');

                if (switchButton)
                    actions.push("switch");
                if (moveButton)
                    actions.push("move");

                if (actions.length > 0) {
                    clearInterval(checkInterval);
                    resolve(actions);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(checkInterval);
                    reject(new Error(`Timeout waiting for move or switch actions (${timeout}ms)`));
                }
            }, interval); // Check every 100ms
        });
    },

    getAvailableActions: async () => {
        type Action = { type: "move" | "switch" | "extra"; index?: number; names: string[] };
        const availableActions: Action[] = [{ type: "extra", names: ["terrastalize", "terra"] }];
    
        try {
            const types = await showdownAPI.waitForActions();
            const getActions = (selector: string, type: Action["type"], getName: (button: HTMLButtonElement) => string) =>
                Array.from(document.querySelectorAll(selector), (button, index) => ({type, index, names: [getName(button as HTMLButtonElement)]}))
                    .filter(action => type !== "switch" || action.index !== 0);
    
            if (types.includes("move")) {
                availableActions.push(...getActions(".movemenu button", "move", btn => btn.dataset.move!));
            }
    
            if (types.includes("switch")) {
                availableActions.push(...getActions(".switchmenu button", "switch", btn => btn.textContent || ""));
            }
    
            return availableActions;
        } catch (error) {
            console.error("showdownAPI: Error in getAvailableActions:", error);
        }
    },

    /**
     * Clicks the 'Run' button for a move during battle.
     * @param {number} moveIndex 1-based index of the move (1, 2, 3, 4 from top to bottom).
     */
    selectMove: async (moveIndex: number) => {
        console.log('showdownAPI: selectMove called with moveIndex:', moveIndex);
        try {
            const moveButtonSelector = `button[name="chooseMove"]:nth-child(${moveIndex})`; // CSS nth-child selector
            await showdownAPI.clickElement(moveButtonSelector);
            return true;
        } catch (error) {
            console.error('showdownAPI: Error in selectMove:', error);
            return false;
        }
    },

    toggleComplimentary: async () => {
        console.log('showdownAPI: toggleComplimentary called');
        try {
            const toggleSelector = '.movemenu input[type="checkbox"]';
            await showdownAPI.clickElement(toggleSelector);
            return true;
        } catch (error) {
            console.error('showdownAPI: Error in toggleComplimentary:', error);
            return false;
        }
    },

    /**
     * Clicks the 'Switch' button and then selects a Pokemon to switch to.
     * @param {number} pokemonIndex 1-based index of the Pokemon in your party (1, 2, 3, ...).
     */
    switchPokemon: async (pokemonIndex: number) => {
        console.log('showdownAPI: switchPokemon called with pokemonIndex:', pokemonIndex);
        try {
            // TODO: Do we need this?
            // await showdownAPI.clickElement('button[name="chooseSwitch"]'); // Click "Switch" button
            const pokemonButtonSelector = `.switchmenu button:nth-child(${pokemonIndex})`;
            await showdownAPI.clickElement(pokemonButtonSelector);
            return true;
        } catch (error) {
            console.error('showdownAPI: Error in switchPokemon:', error);
            return false;
        }
    },
};

contextBridge.exposeInMainWorld("queueAPI", queueAPI);
contextBridge.exposeInMainWorld("handlerAPI", handlerAPI);
contextBridge.exposeInMainWorld("mainAPI", mainAPI);
contextBridge.exposeInMainWorld("showdownAPI", showdownAPI);

export { queueAPI, handlerAPI, mainAPI, showdownAPI };
