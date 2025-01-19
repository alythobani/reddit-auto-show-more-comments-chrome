import { logMessage } from "./logger";

const INTERVAL_MS = 3000;
const MAX_NUM_CHECKS = 5;

const BUTTON_NAMES_TO_CLICK = [
  "View more comments",
  "more replies",
  "1 more reply",
];

function main(): void {
  clickAllButtons();
}

function clickAllButtons(numChecksSoFar = 0): void {
  if (numChecksSoFar >= MAX_NUM_CHECKS) {
    return;
  }
  logMessage("Finding buttons to click");
  document
    .querySelectorAll<HTMLSpanElement>("button span")
    .forEach((buttonSpan) => {
      if (!isButtonToClick(buttonSpan)) {
        return;
      }
      clickButtonSpan(buttonSpan);
    });
  setTimeout(() => clickAllButtons(numChecksSoFar + 1), INTERVAL_MS);
}

function isButtonToClick(buttonSpan: HTMLSpanElement): boolean {
  return BUTTON_NAMES_TO_CLICK.some((name) =>
    buttonSpan.innerText.includes(name)
  );
}

function clickButtonSpan(buttonSpan: HTMLSpanElement): void {
  logMessage(`Clicking '${buttonSpan.innerText.trim()}' button`);
  buttonSpan.click();
}

main();
