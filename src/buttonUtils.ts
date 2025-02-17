import { logMessage } from "./logger";

export function isButtonVisibleOrAlmostVisibleInViewport(
  button: HTMLButtonElement
): boolean {
  const { top, bottom } = button.getBoundingClientRect();
  return (
    top >= 0 && bottom <= window.innerHeight * 2 && !isButtonHidden(button)
  );
}

export function isButtonVisibleInViewport(button: HTMLButtonElement): boolean {
  const { top, bottom } = button.getBoundingClientRect();
  return top >= 0 && bottom <= window.innerHeight && !isButtonHidden(button);
}

export function isButtonHidden(button: HTMLButtonElement): boolean {
  return button.offsetParent === null;
}

export function clickButton(
  button: HTMLButtonElement,
  shouldLog: boolean
): void {
  if (shouldLog) {
    const buttonName = button.innerText.trim();
    logMessage(`Clicking '${buttonName}' button`);
  }
  button.click();
}

export function runActionOnAllButtonsInDocumentAndShadowRoots(
  buttonAction: (button: HTMLButtonElement) => void
): void {
  runActionOnAllButtonsInDocument(buttonAction);
  const shadowRoots = getAllShadowRoots();
  shadowRoots.forEach((shadowRoot) => {
    shadowRoot
      .querySelectorAll<HTMLButtonElement>("button")
      .forEach(buttonAction);
  });
}

export function runActionOnAllButtonsInDocument(
  buttonAction: (button: HTMLButtonElement) => void
): void {
  document.querySelectorAll<HTMLButtonElement>("button").forEach(buttonAction);
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
