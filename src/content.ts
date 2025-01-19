import { logMessage } from "./logger";

const BUTTON_NAMES_TO_CLICK = [
  "View more comments",
  "more replies",
  "1 more reply",
];

function main(): void {
  observeDOMChanges();
}

function observeDOMChanges(): void {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) {
          return;
        }
        clickAllButtonsInElement(node);
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  clickAllButtonsInElement(document.body); // Initial check on page load
}

function clickAllButtonsInElement(element: HTMLElement): void {
  if (element instanceof HTMLButtonElement) {
    maybeClickButton(element);
    return;
  }
  element.querySelectorAll("button").forEach(maybeClickButton);
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
