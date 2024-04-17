import fs from "node:fs/promises";
import path from "node:path";
import { rimraf } from "rimraf";

function getLanguageFolderPath(givenPath: string, platform: string) {
  switch (platform) {
    case "darwin":
    case "mas":
      return path.resolve(givenPath, "..");
    case "win32":
    case "linux":
      return path.resolve(givenPath, "..", "..", "locales");
    default:
      return path.resolve(givenPath);
  }
}

function getLanguageFileExtension(platform: string) {
  switch (platform) {
    case "darwin":
    case "mas":
      return "lproj";
    case "win32":
    case "linux":
      return "pak";
    default:
      return "";
  }
}

async function walkLanguagePaths(dir: string, platform: string) {
  const regex = new RegExp(`.(${getLanguageFileExtension(platform)})$`);
  const paths = await fs.readdir(dir);

  switch (platform) {
    case "darwin":
    case "mas":
      return paths.filter(async (currentPath) => {
        const stat = await fs.stat(path.resolve(dir, currentPath));
        return stat.isDirectory() && regex.test(currentPath);
      });
    case "win32":
    case "linux":
      return paths;
    default:
      return [];
  }
}

async function setLanguages(
  languages: string[],
  buildPath: string,
  platform: string
) {
  const resourcePath = getLanguageFolderPath(buildPath, platform);
  const excludedLanguages = languages.map(
    (l) => `${l}.${getLanguageFileExtension(platform)}`
  );
  const languageFolders = await walkLanguagePaths(resourcePath, platform);

  languageFolders
    .filter((langFolder) => !excludedLanguages.includes(langFolder))
    .forEach(
      async (langFolder) => await rimraf(path.resolve(resourcePath, langFolder))
    );
}

export { setLanguages };
