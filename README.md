<div align="center">
<img src="img/ytplays.png" alt="logo" width=300 />
</div>
<h1>YouTube Plays, inspired by Astroid Videos' latest streams</h1>
<p>Uses the LiveChat of YouTube to send keyboard keys or strings (text) to the currently active window.<br>Specifically made for Pokemon and I plan to basically revolve the features around PokeTubers, after all, I made this originally for Frank.</p>

<h4 align="center"> <span> · </span> <a href="https://github.com/Agash/YTPlays/blob/master/README.md"> Documentation </a> <span> · </span> <a href="https://github.com/Agash/YTPlays/issues"> Report Bug </a> <span> · </span> <a href="https://github.com/Agash/YTPlays/issues"> Request Feature </a> </h4>

# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
- [Todos](#compass-roadmap)
- [Contact](#handshake-contact)
- [Acknowledgements](#gem-acknowledgements)

## :star2: About the Project

So Frank ([Astroid Videos on YouTube](https://www.youtube.com/@AstroidmaniaVideos)) had some fun ideas for streams with chat. I thought I'd implement those. He actually got a couple of people helping him out, so I took the time to fix up a GUI (still messy code tho). It can do TwitchPlays style chat control with 3 modes (democracy, monarchy, anarchy) and also let chat type pokemon names, another great stream from Frank (also coding detours are always fun to watch).

### :camera: Screenshots

<div align="center">
    <img src="img/democracy.png" alt='Democracy Mode' width='300'/> &nbsp;
    <img src="img/monarchy.png" alt='Monarchy Mode' width='300'/> &nbsp;
    <img src="img/anarchy.png" alt='Anarchy Mode' width='300'/> &nbsp;
    <img src="img/names.png" alt='Pokemon Names' width='300'/> &nbsp;
    <img src="img/config.png" alt='Config' width='300'/>
</div>

### :space_invader: Tech Stack

<li><a href="https://react.dev/">react</a></li>

<li><a href="https://www.electronjs.org/">electron</a></li>

## :toolbox: Getting Started

### :gear: Installation

Download the latest setup file `ytplays-X.X.X.Setup.exe` under [releases](https://github.com/Agash/YTPlays/releases/latest) and double click on it. It'll install and automatically create a shortcut called ytplays.

### :fast_forward: Usage

Look for ytplays in your start menu and open it. You'll be presented with following form:

<p><img src="img/config.png" alt='Config' width='300'/></p>

#### Form Fields

- **YouTube Video ID:**<br />
  The identifier of your live stream, generally the last part of your YouTube Link in your Browser. For example, if your YouTube Livestream has following link: https://www.youtube.com/watch?v=0zmlnOxmrsg the correct ID would be **0zmlnOxmrsg**
- **Mode**<br/>
  - _Democracy_:<br />
    The chat command with most votes within a set time frame will win and be executed. Only valid buttons will be accepted as commands and the time frame is configurable further in the config.
  - _Monarchy_: <br />
    A ruler will be selected and within a set timeframe all commands of said ruler will be executed. The next ruler will be
    selected out of all active users still typing a certain amount (threshold) of valid commands, since the selection of the last ruler. This is to avoid choosing a monarch out of not recently active users. The timeframe and the threshold are both configurable further in the config.
  - _Anarchy_: <br />
    Within a set timeframe (to avoid non-recent, still in-queue commands flooding the game during message spikes) all valid commands will be selected, the latest command of that list will be executed. Thus it's more or less luck based. Timeframe is configurable further in the config.
  - _Names_: <br />
    All valid pokemon names will be collected and immediately typed out by the keyboard. This was made specifically for when [Frank wanted to let chat play pkmnquiz](https://www.youtube.com/watch?v=9TMslV0kvcM).
- **Democracy Countdown:**<br/>
  Time in Milliseconds, for how long votes will be collected. After that period, the most recent, most voted command will be executed and all votes will be reset.
- **Monarchy Cooldown:**<br/>
  Time in Milliseconds, for how long the Monarch/Ruler has complete control. Choose this to be a bit bigger than you would the Democracy Countdown, simply because of lag. The user will need a while until he sees he's the monarch and to write down actual properly managed chain of commands. After this timeframe, out of all the eligible users, one will be **_randomly_** selected.
- **Monarchy Threshold:**<br/>
  The amount of valid commands a user must have typed in since the last Monarch/Ruler was chosen (or during his rule so to say), to be eligible as next monarch.
  For example: UserA is now monarch, for the next 30 seconds. Threshold is set to 3. All users that within these 30 seconds, have also typed at least 3 valid commands in chat, are eligible to be the next monarch after the complete 30 seconds are over.
  Everything will be reset and started again with the new randomly chosen UserB.
- **Normal Interval:**<br/>
  Time in Milliseconds, general polling interval. This is used in Anarchy Mode and any further modes, not needing any specific timeframe. This is mostly to slow down the typing and commands. My recommendation is set this to anything from 200ms to 1500ms ymmv tho.

Click on the Button "Take Off!" and you're good to go. Any settings you chose will be saved for the future.

If you want to stop the inputs and processing, simply click the "Back" button to return to this config screen.

_**Note: It might take a couple of seconds for the LiveChat to load and start processing the messages. Take this time to focus the window or program (click on it) to make sure any keyboard inputs are directed towards that window.**_

#### Mod commands:

- **!setmode {mode}**<br/>
  Where **{mode}** (required parameter) is either one of the supported modes (democracy, anarchy, monarchy)<br/>
  _Example: !setmode democracy_

- **!setmonarch {username} {timeInMs}**<br/>
  Where **{username}** (required parameter) is a valid full username as they appear in chat (with or without @) and **{timeInMs}** (optional parameter) is the amount of time in milliseconds given for the monarchy, after which the normal schedule will continue. If not set, the default timeout from the settings will be used.<br/>
**CURRENTLY BUGGED WITH USERNAMES WITH WHITESPACES IN THEM**<br/>
  _Example: !setmonarch thmo\_ 120000_<br/>
  _Example2: !setmonarch @thmo\__

- **!setstreamdelay {delayInMs}**<br/>
  Where **{delayInMs}** (required parameter) is the amount of stream delay in milliseconds, this setting is the same as the one in settings and will overwrite it accordingly.<br/>
  _Example: !setstreamdelay 2500_

- **!setTimeout {timeOutInMs}**<br/>
  Where **{timeOutInMs}** (required parameter) is the amount of timeout in milliseconds, during which commands are collected before being processed. This setting correlates with "Normal Timeout" in Monarchy and Anarchy mode and "Democracy Countdown" in Democracy mode.<br/>
  _Example: !settimeout 2500_

- **!press {command}**<br/>
  Where **{command}** (required parameter) is the command to be executed. These can be any of the button mappings in the currently active button preset.<br/>
  _Example: !press up_

## :white_check_mark: Todos

- [x] basic functionality
- [x] basic GUI
- [ ] write tests
- [ ] button remapping
- [ ] controller simulation
- [ ] possibly rewrite everything afterwards using maybe C# after shaking down the concept..

## :handshake: Contact

Agash - [Twitter](https://twitter.com/a_thmo_)

Project Link: [https://github.com/Agash/YTPlays](https://github.com/Agash/YTPlays)

## :gem: Acknowledgements

This project wouldn't be possible without the amazing YouTube.js library, since YouTube's API is useless for these use cases.

- [YouTube.js by LuanRT](https://github.com/LuanRT/YouTube.js)

Inspired by:

- [YoutubePlays by XLuma](https://github.com/XLuma/YoutubePlays/)

## :scroll: Disclaimer

This project is not affiliated with, endorsed, or sponsored by YouTube nor Pokemon or any of its affiliates or subsidiaries. All trademarks, logos, and brand names used in this project are the property of their respective owners and are used solely to describe the services provided.

As such, any usage of trademarks to refer to such services is considered nominative use. If you have any questions or concerns, please contact me directly via email.

## :book: License

Distributed under the [MIT](https://github.com/Agash/YTPlays?tab=MIT-1-ov-file#readme) License.

<p align=" right">
[<a href="#top">back to top</a>]
</p>
