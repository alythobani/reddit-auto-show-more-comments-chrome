import { logMessage } from "./logger";

const BUTTON_NAMES_TO_CLICK = [
  "View more comments",
  "more replies",
  "1 more reply",
];

function main(): void {
  clickAllButtons(); // Initial check on page load
  observeDOMChanges();
}

function observeDOMChanges(): void {
  const observer = new MutationObserver(clickAllButtons);
  observer.observe(document.body, { childList: true, subtree: true });
}

function clickAllButtons(): void {
  document.body.querySelectorAll("button").forEach(maybeClickButton);
}

function maybeClickButton(button: HTMLButtonElement): void {
  if (!isButtonToClick(button)) {
    return;
  }
  clickButton(button);
}

function isButtonToClick(button: HTMLButtonElement): boolean {
  return BUTTON_NAMES_TO_CLICK.some((name) => button.innerText.includes(name));
}

function clickButton(button: HTMLButtonElement): void {
  logMessage(`Clicking '${button.innerText.trim()}' button`);
  button.click();
}

main();
