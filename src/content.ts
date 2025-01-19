import { logMessage } from "./logger";

const INTERVAL_MS = 3000;
const MAX_NUM_CHECKS = 5;

type IntervalState = {
  id: NodeJS.Timeout | null;
  numChecks: number;
};

type State = {
  viewMoreCommentsIntervalState: IntervalState;
  moreRepliesIntervalState: IntervalState;
};

function main(): void {
  const state = initializeState();
  clickViewMoreComments(state.viewMoreCommentsIntervalState);
  clickMoreRepliesButtons(state.moreRepliesIntervalState);
  state.viewMoreCommentsIntervalState.id = setInterval(
    () => clickViewMoreComments(state.viewMoreCommentsIntervalState),
    INTERVAL_MS
  );
  state.moreRepliesIntervalState.id = setInterval(
    () => clickMoreRepliesButtons(state.moreRepliesIntervalState),
    INTERVAL_MS
  );
}

function initializeState(): State {
  return {
    viewMoreCommentsIntervalState: { id: null, numChecks: 0 },
    moreRepliesIntervalState: { id: null, numChecks: 0 },
  };
}

function clickViewMoreComments(intervalState: IntervalState): void {
  const didStop = maybeStopInterval(intervalState);
  if (didStop) return;
  intervalState.numChecks += 1;
  document
    .querySelectorAll<HTMLSpanElement>("button span")
    .forEach((buttonSpan) => {
      if (!buttonSpan.innerText.includes("View more comments")) {
        return;
      }
      clickButtonSpan(buttonSpan);
    });
}

function clickMoreRepliesButtons(intervalState: IntervalState): void {
  const didStop = maybeStopInterval(intervalState);
  if (didStop) return;
  intervalState.numChecks += 1;
  document
    .querySelectorAll<HTMLSpanElement>("button span.text-secondary-weak")
    .forEach((buttonSpan) => {
      if (!buttonSpan.innerText.includes("more replies")) {
        return;
      }
      clickButtonSpan(buttonSpan);
    });
}

function clickButtonSpan(buttonSpan: HTMLSpanElement): void {
  logMessage(`Clicking '${buttonSpan.innerText.trim()}' button`);
  buttonSpan.click();
}

function maybeStopInterval(intervalState: IntervalState): boolean {
  if (intervalState.numChecks < MAX_NUM_CHECKS) {
    return false;
  }
  if (intervalState.id === null) {
    return true;
  }
  clearInterval(intervalState.id);
  intervalState.id = null;
  return true;
}

main();
