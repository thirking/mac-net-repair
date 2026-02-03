import { platform } from "@tauri-apps/plugin-os";

export async function isMacOS(): Promise<boolean> {
  try {
    const currentPlatform = await platform();
    return currentPlatform === "macos";
  } catch {
    return false;
  }
}

export function getTrafficLightSafeAreaClasses(isMac: boolean): string {
  return isMac ? "pt-6" : "pt-6";
}
