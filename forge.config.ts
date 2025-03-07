import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { AutoUnpackNativesPlugin } from "@electron-forge/plugin-auto-unpack-natives";
import { ElectronegativityPlugin } from "@electron-forge/plugin-electronegativity";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";

import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";
import { setLanguages } from "./forge/packager-hooks";

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: "ytplays-icon",
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      iconUrl:
        "https://raw.githubusercontent.com/Agash/YTPlays/master/ytplays-icon.ico",
      setupIcon: "ytplays-icon.ico",
    }),
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "Agash",
          name: "YTPlays",
        },
        draft: true,
        prerelease: true,
      },
    },
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    // new ElectronegativityPlugin({ isSarif: true }),
    new WebpackPlugin({
      devContentSecurityPolicy:
        "default-src * self blob: data: gap:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap:; object-src * 'self' blob: data: gap:; img-src * self 'unsafe-inline' blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;",
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./src/index.html",
            js: "./src/frontend/renderer.ts",
            name: "main_window",
            preload: {
              js: "./src/frontend/preload.ts",
            },
          },
        ],
      },
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  hooks: {
    packageAfterCopy: async (
      _config,
      buildPath,
      _electronVersion,
      platform,
      _arch
    ) => {
      await setLanguages(["en", "en-GB"], buildPath, platform);
    },
  },
};

export default config;
