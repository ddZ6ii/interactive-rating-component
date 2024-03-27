export const focusRadioById = (radioId) =>
  document.querySelector(`${radioId}`).focus();

export const validateRadioByName = (radioName) => {
  const selection =
    document.querySelector(`input[name=${radioName}]:checked`)?.value ?? '';
  const isValid = selection.length !== 0;
  return {
    isValid,
    errorMessage: isValid ? '' : 'Please select a rating to continue.',
  };
};

export const updateFeedback = (nodeId, status) => {
  const errorEl = document.querySelector(`${nodeId}`);
  // Update error message.
  errorEl.querySelector(`${nodeId}-message`).innerText = status.errorMessage;
  // Update error visibility.
  errorEl.classList.toggle('hidden', status.isValid);
  // Update submit button state.
  document
    .querySelector('button[type="submit"]')
    .toggleAttribute('disabled', !status.isValid);
};

export const swapPages = (pages) => {
  let currentIndex = 0;

  // Check for user's motion preferences.
  const hasMotionDisabled = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  // Swap pages without animation.
  if (hasMotionDisabled) {
    pages[currentIndex].classList.add('hidden');
    currentIndex += 1;
    pages[currentIndex].classList.remove('hidden');
    return;
  }

  // Animate swap pages
  // 1. Fade-out current page.
  pages[currentIndex].classList.add('fading-out');
  // 2. Fade-in next page.
  // 2.1 Wait until animation ends...
  pages[currentIndex].addEventListener('animationend', () => {
    // 2.2. ...then completely hide the page ...
    pages[currentIndex].classList.replace('fading-out', 'hidden');
    // 2.3. ... finally animate-in the new page.
    currentIndex += 1;
    pages[currentIndex].classList.remove('hidden');
  });
};
