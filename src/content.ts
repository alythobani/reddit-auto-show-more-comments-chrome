import { logMessage } from "./logger";

const BUTTON_NAMES_TO_CLICK = [
  "View more comments",
  "more replies",
  "1 more reply",
];

function main(): void {
  logMessage("Initializing button clicker...");
  observeDOMChanges();
}

function observeDOMChanges(): void {
  const observer = new MutationObserver(() => {
    logMessage("DOM updated, searching for buttons to click...");
    clickAllButtons();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  clickAllButtons(); // Initial check on page load
}

function clickAllButtons(): void {
  document
    .querySelectorAll<HTMLSpanElement>("button span")
    .forEach((buttonSpan) => {
      if (!isButtonToClick(buttonSpan)) {
        return;
      }
      clickButtonSpan(buttonSpan);
    });
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
