import { BrowserWindow, app } from "electron";
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
import {
  getRandomChatInput,
  getRandomPkmnName,
  isValidCommand,
  tapKey,
} from "../utils";

export class LiveChat {
  config: StoreType;
  videoId: string;
  handler: IGameplayHandler;
  liveChat: YTChat;
  mainWindow: BrowserWindow;

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
      this.liveChat.applyFilter("LIVE_CHAT");
    });
    this.liveChat.on("start", (initial_data: LiveChatContinuation) =>
      this.handleContinuation(initial_data)
    );
    this.liveChat.on("chat-update", (action: ChatAction) =>
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
  }

  handleChatUpdate(action: ChatAction) {
    /**
     * An action represents what is being added to
     * the live chat. All actions have a `type` property,
     * including their item (if the action has an item).
     *
     * Below are a few examples of how this can be used.
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
            this.executeModCommand(ytmsg.message.toString().toLowerCase());
          } else {
            const chatMsg: ChatMessage = {
              message: ytmsg.message.toString().toLowerCase(),
              timestamp: new Date(
                ytmsg.hasKey("timestamp") ? ytmsg.timestamp : Date.now()
              ),
              username: ytmsg.author.name,
            };

            // if (!app.isPackaged)
            //   chatMsg.message =
            //     this.config.settings.mode == "names"
            //       ? getRandomPkmnName()
            //       : getRandomChatInput(this.config.settings.buttonPreset);

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
    if (ytmsg.author.is_moderator || ytmsg.author.name == "thmo_") {
      const message = ytmsg.message.toString();
      if (message.startsWith("!")) return true;
    }

    return false;
  }

  private executeModCommand(commandMessage: string) {
    const [command, ...commandArgs] = commandMessage.split(" ");

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
          const timeOut =
            commandArgs.length > 1 ? parseInt(commandArgs[1]) : null;
          const monarch = commandArgs[0].startsWith("@")
            ? commandArgs[0].substring(1)
            : commandArgs[0];
          this.handler.setMonarch(monarch, timeOut);
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
      case modCommands.press: {
        if (
          commandArgs.length > 0 &&
          isValidCommand(commandArgs[0], this.config.settings.buttonPreset)
        ) {
          tapKey(commandArgs[0], this.config.settings.buttonPreset);
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
