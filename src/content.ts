import { logMessage } from "./logger";

const BUTTON_NAMES_TO_CLICK = [
  "View more comments",
  "more replies",
  "1 more reply",
];

const EXPAND_THREAD_INTERVAL_MS = 2000;
const VIEW_MORE_COMMENTS_INTERVAL_MS = 2000;

const MAX_NUM_EXPAND_THREAD_RUNS = 4;
const MAX_NUM_VIEW_MORE_COMMENTS_RUNS = 3;

function main(): void {
  clickAllExpandThreadButtons(0); // Initial run
  clickAllViewMoreCommentsButtons(0); // Initial run
  observeDOMChangesToViewMoreComments();
}

function getAllShadowRoots(): ShadowRoot[] {
  const shadowRoots: ShadowRoot[] = [];
  document.querySelectorAll("*").forEach((element) => {
    if (element.shadowRoot !== null) {
      shadowRoots.push(element.shadowRoot);
    }
  });
  return shadowRoots;
}

function clickAllExpandThreadButtons(numRuns: number): void {
  if (numRuns >= MAX_NUM_EXPAND_THREAD_RUNS) {
    return;
  }
  runActionOnAllButtonsInDocument(maybeClickExpandThreadButton);
  setTimeout(
    () => clickAllExpandThreadButtons(numRuns + 1),
    EXPAND_THREAD_INTERVAL_MS
  );
}

function runActionOnAllButtonsInDocument(
  buttonAction: (button: HTMLButtonElement) => void
): void {
  const shadowRoots = getAllShadowRoots();
  document.querySelectorAll<HTMLButtonElement>("button").forEach(buttonAction);
  shadowRoots.forEach((shadowRoot) => {
    shadowRoot
      .querySelectorAll<HTMLButtonElement>("button")
      .forEach(buttonAction);
  });
}

function maybeClickExpandThreadButton(button: HTMLButtonElement): void {
  if (!isExpandThreadButton(button)) {
    return;
  }
  if (!isButtonVisible(button)) {
    return;
  }
  clickButton(button, "Expand thread");
}

function isExpandThreadButton(button: HTMLButtonElement): boolean {
  return (
    button.querySelector("svg")?.getAttribute("icon-name") === "join-outline"
  );
}

function observeDOMChangesToViewMoreComments(): void {
  const observer = new MutationObserver(() =>
    clickAllViewMoreCommentsButtons(0)
  );
  observer.observe(document.body, { childList: true, subtree: true });
}

function clickAllViewMoreCommentsButtons(numRuns: number): void {
  if (numRuns >= MAX_NUM_VIEW_MORE_COMMENTS_RUNS) {
    return;
  }
  document.body.querySelectorAll("button").forEach(maybeClickButton);
  setTimeout(
    () => clickAllViewMoreCommentsButtons(numRuns + 1),
    VIEW_MORE_COMMENTS_INTERVAL_MS
  );
}

function maybeClickButton(button: HTMLButtonElement): void {
  if (!isButtonToClick(button)) {
    return;
  }
  if (!isButtonVisible(button)) {
    return;
  }
  clickButton(button);
}

function isButtonToClick(button: HTMLButtonElement): boolean {
  return BUTTON_NAMES_TO_CLICK.some((name) => button.innerText.includes(name));
}

function isButtonVisible(button: HTMLButtonElement): boolean {
  return button.offsetParent !== null;
}

function clickButton(
  button: HTMLButtonElement,
  buttonName = button.innerText.trim()
): void {
  logMessage(`Clicking '${buttonName}' button`);
  button.click();
}

main();
