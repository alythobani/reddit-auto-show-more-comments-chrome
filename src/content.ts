import {
  clickButton,
  isButtonVisibleOrAlmostVisibleInViewport,
  runActionOnAllButtonsInDocument,
  runActionOnAllButtonsInDocumentAndShadowRoots,
} from "./buttonUtils";
import { logMessage } from "./logger";

const VIEW_MORE_COMMENTS_BUTTON_NAMES = [
  "View more comments",
  "more replies",
  "1 more reply",
];

const EXPAND_THREAD_BUTTON_BATCH_SIZE = 5;
const EXPAND_THREAD_INTERVAL_MS = 1000;
let isProcessingExpandThreadButtons = false;

const VIEW_MORE_COMMENTS_BUTTON_BATCH_SIZE = 5;
const VIEW_MORE_COMMENTS_INTERVAL_MS = 1000;
let isProcessingViewMoreCommentsButtons = false;

const expandThreadButtonsSet = new Set<HTMLButtonElement>();

const viewMoreCommentsButtonsSet = new Set<HTMLButtonElement>();

function main(): void {
  collectExpandThreadButtons();
  processExpandThreadButtons();
  collectAndProcessViewMoreCommentsButtons();
  observeDOMChangesToViewMoreComments();
}

function collectExpandThreadButtons(): void {
  runActionOnAllButtonsInDocumentAndShadowRoots(maybeCollectExpandThreadButton);
}

function maybeCollectExpandThreadButton(button: HTMLButtonElement): void {
  if (!isExpandThreadButton(button)) {
    return;
  }
  expandThreadButtonsSet.add(button);
}

function isExpandThreadButton(button: HTMLButtonElement): boolean {
  return (
    button.querySelector("svg")?.getAttribute("icon-name") === "join-outline" &&
    button.innerText.trim() === ""
  );
}

function observeDOMChangesToViewMoreComments(): void {
  const observer = new MutationObserver((mutations) => {
    collectAndProcessViewMoreCommentsButtons();
    collectAndProcessNewExpandThreadButtons(mutations);
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function collectAndProcessViewMoreCommentsButtons(): void {
  collectViewMoreCommentsButtons();
  if (!isProcessingViewMoreCommentsButtons) processViewMoreCommentsButtons();
}

function collectViewMoreCommentsButtons(): void {
  runActionOnAllButtonsInDocument(maybeCollectViewMoreCommentsButton);
}

function maybeCollectViewMoreCommentsButton(button: HTMLButtonElement): void {
  if (!isViewMoreCommentsButton(button)) {
    return;
  }
  viewMoreCommentsButtonsSet.add(button);
}

function processViewMoreCommentsButtons(): void {
  isProcessingViewMoreCommentsButtons = true;
  if (viewMoreCommentsButtonsSet.size === 0) {
    isProcessingViewMoreCommentsButtons = false;
    return;
  }
  let numButtonsClicked = 0;
  for (const button of viewMoreCommentsButtonsSet) {
    if (!isButtonVisibleOrAlmostVisibleInViewport(button)) {
      continue;
    }
    clickButton(button, true);
    viewMoreCommentsButtonsSet.delete(button);
    if (++numButtonsClicked >= VIEW_MORE_COMMENTS_BUTTON_BATCH_SIZE) {
      break;
    }
  }
  setTimeout(processViewMoreCommentsButtons, VIEW_MORE_COMMENTS_INTERVAL_MS);
}

function isViewMoreCommentsButton(button: HTMLButtonElement): boolean {
  return VIEW_MORE_COMMENTS_BUTTON_NAMES.some((name) =>
    button.innerText.includes(name)
  );
}

function collectAndProcessNewExpandThreadButtons(
  mutations: MutationRecord[]
): void {
  const numNewExpandThreadButtonsFound =
    collectNewExpandThreadButtons(mutations);
  if (numNewExpandThreadButtonsFound > 0) {
    logMessage(
      `Found ${numNewExpandThreadButtonsFound} new 'Expand thread' buttons`
    );
    if (!isProcessingExpandThreadButtons) processExpandThreadButtons();
  }
}

function collectNewExpandThreadButtons(mutations: MutationRecord[]): number {
  let numNewExpandThreadButtonsFound = 0;
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((newNode) => {
      if (!(newNode instanceof HTMLElement)) {
        return;
      }
      newNode
        .querySelectorAll<HTMLButtonElement>("button")
        .forEach((button) => {
          if (!isExpandThreadButton(button)) {
            return;
          }
          expandThreadButtonsSet.add(button);
          numNewExpandThreadButtonsFound++;
        });
    });
  });
  return numNewExpandThreadButtonsFound;
}

function processExpandThreadButtons(): void {
  isProcessingExpandThreadButtons = true;
  if (expandThreadButtonsSet.size === 0) {
    isProcessingExpandThreadButtons = false;
    return;
  }
  let numButtonsClicked = 0;
  for (const button of expandThreadButtonsSet) {
    if (!isButtonVisibleOrAlmostVisibleInViewport(button)) {
      continue;
    }
    clickButton(button, false);
    expandThreadButtonsSet.delete(button);
    if (++numButtonsClicked >= EXPAND_THREAD_BUTTON_BATCH_SIZE) {
      break;
    }
  }
  if (numButtonsClicked > 0) {
    logMessage(`Clicked ${numButtonsClicked} 'Expand thread' buttons`);
  }
  setTimeout(processExpandThreadButtons, EXPAND_THREAD_INTERVAL_MS);
}

main();
