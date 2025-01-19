export function logMessage(message: string): void {
  const extensionName = chrome.runtime.getManifest().name;
  console.log(`${extensionName}: ${message}`);
}
