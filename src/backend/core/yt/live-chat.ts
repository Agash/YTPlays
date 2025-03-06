import { BrowserWindow } from "electron";
import {
  Innertube,
  LiveChatContinuation,
  UniversalCache,
  YTNodes,
} from "youtubei.js";
import { LiveChatTextMessage } from "youtubei.js/dist/src/parser/nodes";
import YTChat, {
  ChatAction,
} from "youtubei.js/dist/src/parser/youtube/LiveChat";
import { modCommands } from "../../../shared/constants";
import { IPC } from "../../../shared/ipc-commands";
import { ChatMessage, Mode } from "../../../shared/types";
import { AnarchyHandler } from "../handler/anarchy-handler";
import { DemocracyHandler } from "../handler/democracy-handler";
import { IGameplayHandler } from "../handler/gameplay-handler";
import { MonarchyHandler } from "../handler/monarchy-handler";
import { NamesHandler } from "../handler/names-handler";
import { StoreType } from "../typing";
import { tapKey } from "../utils";

export class LiveChat {
  streamer: string;
  config: StoreType;
  videoId: string;
  handler: IGameplayHandler;
  liveChat: YTChat;
  mainWindow: BrowserWindow;
  bannedUsers: Set<string> = new Set();

  async start(mainWindow: BrowserWindow, config: StoreType) {
    this.mainWindow = mainWindow;
    this.config = config;

    const yt = await Innertube.create({
      cache: new UniversalCache(false),
      generate_session_locally: true,
    });

    const info = await yt.getInfo(this.config.video.id);

    this.liveChat = info.getLiveChat();
    this.attachHandler(this.config.settings.mode);

    this.liveChat.once("start", (_) => {
      // Get all chat, not just TOP
      this.liveChat.applyFilter("LIVE_CHAT");
    });

    this.liveChat.on("start", (initial_data: LiveChatContinuation) =>
      // load initial chat data (bulk messages)
      this.handleContinuation(initial_data)
    );

    this.liveChat.on("chat-update", (action: ChatAction) =>
      // handle incoming singular chat messages
      this.handleChatUpdate(action)
    );

    this.liveChat.start();
  }

  stop() {
    this.liveChat?.stop();
    this.handler?.exit();
  }

  handleContinuation(initial_data: LiveChatContinuation) {
    /**
     * Initial info is what you see when you first open a Live Chat — this is; initial actions (pinned messages, top donations..), account's info and so on.
     */
    console.info("[YTPlays] Started LiveChat", initial_data);

    var owner = initial_data.participants_list.participants.find(p => p.badges.find(b => b.hasKey("icon_type") && b.icon_type == "OWNER"));
    if (owner) {
      this.streamer = owner.name.toString();
    }
  }

  handleChatUpdate(action: ChatAction) {
    /**
     * An action represents what is being added to
     * the live chat. All actions have a `type` property,
     * including their item (if the action has an item).
     */
    if (action.is(YTNodes.AddChatItemAction)) {
      const item = action.as(YTNodes.AddChatItemAction).item;

      if (!item)
        return console.warn("[YTPlays] Action did not have an item.", action);

      const hours = new Date(
        item.hasKey("timestamp") ? item.timestamp : Date.now()
      ).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      switch (item.type) {
        case "LiveChatTextMessage": {
          const ytmsg = item.as(YTNodes.LiveChatTextMessage);

          if (this.isValidModCommand(ytmsg)) {
            this.executeModCommand(ytmsg.message.toString());
          } else {
            if (this.bannedUsers.has(ytmsg.author.name))
              break;

            const chatMsg: ChatMessage = {
              message: ytmsg.message.toString().toLowerCase(),
              timestamp: new Date(
                ytmsg.hasKey("timestamp") ? ytmsg.timestamp : Date.now()
              ),
              username: ytmsg.author.name,
            };

            this.handler?.handleChatMessage(chatMsg);
          }
          break;
        }
        case "LiveChatPaidMessage":
          console.info(
            `${hours} - ${item
              .as(YTNodes.LiveChatPaidMessage)
              .author.name.toString()}:\n` +
            `${item.as(YTNodes.LiveChatPaidMessage).purchase_amount}: ${item
              .as(YTNodes.LiveChatPaidMessage)
              .message.toString()}\n`
          );
          break;
        default:
          console.debug(action);
          break;
      }
    }

    if (action.is(YTNodes.RemoveChatItemAction)) {
      console.warn(`Message ${action.target_item_id} just got deleted!`, "\n");
    }
  }

  exit(): void {
    this.handler?.exit();
  }

  private isValidModCommand(ytmsg: LiveChatTextMessage): boolean {
    if (
      ytmsg.author.is_moderator ||
      ytmsg.author.id == "UCaB_PrFSBtCtRbLBkDXoGtQ" ||
      ytmsg.author.name == this.streamer
    ) {
      const message = ytmsg.message.toString();
      if (message.startsWith("!")) return true;
    }

    return false;
  }

  private executeModCommand(commandMessage: string) {
    const [command, ...commandArgs] = commandMessage.toLowerCase().split(" ");

    switch (command) {
      case modCommands.setMode: {
        if (
          commandArgs.length > 0 &&
          ["monarchy", "democracy", "anarchy"].indexOf(commandArgs[0]) != -1
        ) {
          this.config.settings.mode = commandArgs[0] as Mode;
          this.handler?.exit();
          this.mainWindow.webContents.send(IPC.MAIN.CONFIG, {
            videoId: this.config.video.id,
            ...this.config.settings,
          });
          this.attachHandler(this.config.settings.mode);
        }
        break;
      }
      case modCommands.setMonarch: {
        if (this.handler instanceof MonarchyHandler && commandArgs.length > 0) {
          const numericMatch = commandMessage.match(/\d+$/);
          const numericPart = numericMatch
            ? parseInt(numericMatch[0], 10)
            : null;
          const commandAndUser = commandMessage.replace(/\s\d+$/, "");
          const username = commandAndUser.substring(
            `${modCommands.setMonarch} `.length
          );
          const monarch = username.startsWith("@")
            ? username.substring(1)
            : username;

          this.handler.setMonarch(monarch, numericPart);
        }
        break;
      }
      case modCommands.setStreamDelay: {
        if (commandArgs.length > 0) {
          const delay = parseInt(commandArgs[0]);
          if (delay > 0) {
            this.config.settings.streamDelay = delay;
            this.handler?.exit();
            this.mainWindow.webContents.send(IPC.MAIN.CONFIG, {
              videoId: this.config.video.id,
              ...this.config.settings,
            });
            this.attachHandler(this.config.settings.mode);
          }
        }
        break;
      }
      case modCommands.setTimeout: {
        if (commandArgs.length > 0) {
          const delay = parseInt(commandArgs[0]);
          if (delay > 0) {
            switch (this.config.settings.mode) {
              case "anarchy":
              case "monarchy":
              case "names":
                this.config.settings.normalInterval = delay;
                break;
              case "democracy":
                this.config.settings.democracyCountdown = delay;
            }
            this.handler?.exit();
            this.mainWindow.webContents.send(IPC.MAIN.CONFIG, {
              videoId: this.config.video.id,
              ...this.config.settings,
            });
            this.attachHandler(this.config.settings.mode);
          }
        }
        break;
      }
      case modCommands.ignore: {
        if (commandArgs.length > 0) {
          let username = commandMessage.substring(
            `${modCommands.ignore} `.length
          );
          username = username.startsWith("@")
            ? username.substring(1)
            : username;
          this.bannedUsers.add(username);
        }
        break;
      }
      case modCommands.press: {
        if (commandArgs.length > 0) {
          tapKey(commandArgs[0], this.config.settings.buttonPreset);
    
          // handle subsequent commands
          for (let i = 1; i < commandArgs.length; i++) {
            setTimeout(() => {
              tapKey(commandArgs[i], this.config.settings.buttonPreset);
            }, i * 500);
          }
        }
        break;
      }
    }
  }

  private attachHandler(mode: Mode): void {
    switch (mode) {
      case "democracy":
        this.handler = new DemocracyHandler(
          {
            timeOutInMs: this.config.settings.democracyCountdown,
            streamDelay: this.config.settings.streamDelay,
            buttonPreset: this.config.settings.buttonPreset,
          },
          this.mainWindow
        );
        break;
      case "monarchy":
        this.handler = new MonarchyHandler(
          {
            timeOutInMs: this.config.settings.normalInterval,
            monarchTimerInMs: this.config.settings.monarchyCooldown,
            monarchThreshold: this.config.settings.monarchyThreshold,
            inactivityTimerInMs: this.config.settings.inactivityTimerInMs,
            buttonPreset: this.config.settings.buttonPreset,
          },
          this.mainWindow
        );
        break;
      case "anarchy":
        this.handler = new AnarchyHandler(
          {
            timeOutInMs: this.config.settings.normalInterval,
            streamDelay: this.config.settings.streamDelay,
            buttonPreset: this.config.settings.buttonPreset,
          },
          this.mainWindow
        );
        break;
      case "names":
        this.handler = new NamesHandler(
          {
            timeOutInMs: this.config.settings.normalInterval,
          },
          this.mainWindow
        );
    }
  }
}
