import { BrowserWindow, app } from "electron";
import {
  Innertube,
  LiveChatContinuation,
  UniversalCache,
  YTNodes,
} from "youtubei.js";
import YTChat, {
  ChatAction,
} from "youtubei.js/dist/src/parser/youtube/LiveChat";
import { IPC } from "../../../shared/ipc-commands";
import { ChatMessage } from "../../../shared/types";
import { AnarchyHandler } from "../handler/anarchy-handler";
import { DemocracyHandler } from "../handler/democracy-handler";
import { IGameplayHandler } from "../handler/gameplay-handler";
import { MonarchyHandler } from "../handler/monarchy-handler";
import { StoreType } from "../typing";
import { NamesHandler } from "../handler/names-handler";
import { getRandomChatInput, getRandomPkmnName } from "../utils";

export class LiveChat {
  config: StoreType;
  videoId: string;
  handler: IGameplayHandler;
  liveChat: YTChat;
  mainWindow: BrowserWindow;

  async start(mainWindow: BrowserWindow, config: StoreType) {
    this.mainWindow = mainWindow;
    this.config = config;
    console.log("[YTPlays] Starting LiveChat with config: ", config);

    const yt = await Innertube.create({
      cache: new UniversalCache(false),
      generate_session_locally: true,
    });

    console.log("[YTPlays] Video ID: ", this.config.video.id);

    const info = await yt.getInfo(this.config.video.id);
    console.log("[YTPlays] Loaded Video: ", info);

    this.liveChat = info.getLiveChat();

    switch (this.config.settings.mode) {
      case "democracy":
        this.handler = new DemocracyHandler(
          { timeOutInMs: this.config.settings.democracyCountdown },
          this.mainWindow
        );
        break;
      case "monarchy":
        this.handler = new MonarchyHandler(
          {
            timeOutInMs: this.config.settings.normalInterval,
            monarchTimerInMs: this.config.settings.monarchyCooldown,
            monarchThreshold: this.config.settings.monarchyThreshold,
          },
          this.mainWindow
        );
        break;
      case "anarchy":
        this.handler = new AnarchyHandler(
          { timeOutInMs: this.config.settings.normalInterval },
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

    console.log("[YTPlays] Adding listeners");
    this.liveChat.once("start", (_) => {
      this.liveChat.applyFilter("LIVE_CHAT");
      console.log("[YTPlays] Switching to Live Chat instead of Top Chat");
    });
    this.liveChat.on("start", (initial_data: LiveChatContinuation) =>
      this.handleContinuation(initial_data)
    );
    this.liveChat.on("chat-update", (action: ChatAction) =>
      this.handleChatUpdate(action)
    );

    console.log("[YTPlays] Start LiveChat");
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
        case "LiveChatTextMessage":
          const ytmsg = item.as(YTNodes.LiveChatTextMessage);
          const chatMsg: ChatMessage = {
            message: ytmsg.message.toString().toLowerCase(),
            timestamp: new Date(
              ytmsg.hasKey("timestamp") ? ytmsg.timestamp : Date.now()
            ),
            username: ytmsg.author.name,
          };

          console.log(
            `[YTPlays] Got chat: [${chatMsg.username}] ${chatMsg.message}`
          );

          if (!app.isPackaged)
            chatMsg.message =
              this.config.settings.mode == "names"
                ? getRandomPkmnName()
                : getRandomChatInput();

          this.handler.handleChatMessage(chatMsg);
          break;
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
}
