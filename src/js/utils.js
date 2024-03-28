const RADIO_STATUS = {
  isValid: false,
  errorMessage: 'Please select a rating to continue.',
};

export const FORM_STATUS = {
  submit: 'submit',
  error: 'error',
};

// Update user feedback (error message and visibility).
export const updateFeedback = (controlEl, status) => {
  const errorEl = controlEl.nextElementSibling;
  errorEl.innerText = status.errorMessage;
  errorEl.classList.toggle('hidden', status.isValid);
};

// Single radio input validation.
export const validateRadio = (radioEl) => {
  if (!(radioEl instanceof Element) || radioEl.type !== 'radio')
    throw new Error('Invalid radio input!');

  const isValid = radioEl.checked;
  return {
    ...RADIO_STATUS,
    isValid,
    errorMessage: isValid ? '' : RADIO_STATUS.errorMessage,
  };
};

// Multiple radio inputs validation.
export const validateRadioGroup = (radioGroupEl) => {
  if (
    (!radioGroupEl) instanceof Element ||
    [...radioGroupEl.querySelectorAll("input[type='radio']")].length === 0 ||
    [...radioGroupEl.querySelectorAll("input[type='radio']")].some(
      (radioEl) => (!radioEl) instanceof Element,
    )
  )
    throw new Error('Invalid radio group!');

  const radioEls = [...radioGroupEl.querySelectorAll("input[type='radio']")];
  const radioStatus = radioEls.reduce((acc, radioEl) => {
    const currentStatus = validateRadio(radioEl);
    return currentStatus.isValid ? currentStatus : acc;
  }, RADIO_STATUS);

  // Update error message.
  updateFeedback(radioGroupEl, radioStatus);

  // Update ARIA attribute for accessibility.
  radioEls.forEach((radioEl) =>
    radioEl.setAttribute('aria-invalid', `${!radioStatus.isValid}`),
  );

  return radioStatus;
};

// Update form controls state and visibility.
export const updateFormStatus = (formEl, formStatus) => {
  if ((!formEl) instanceof Element)
    throw new Error('Invalid form node element!');

  if (!Object.values(FORM_STATUS).includes(formStatus))
    throw new Error('Invalid form status!');

  const isSubmitting = formStatus === FORM_STATUS.submit;
  const hasError = formStatus === FORM_STATUS.error;
  const radioGroup = formEl.querySelector('.radio-group');
  const radios = [...radioGroup.querySelectorAll("input[type='radio']")];
  const btn = formEl.querySelector('button[type="submit"]');
  const btnLoader = btn.querySelector('.loader');
  const btnLabel = btn.querySelector('.label');

  radioGroup.disabled = isSubmitting;
  btn.disabled = isSubmitting;
  btnLoader.classList.toggle('hidden', !isSubmitting);
  btnLabel.classList.toggle('hidden', isSubmitting);
  // Invalid form data -> focus 5 stars radio input.
  if (hasError) radios.at(-1).focus();
};

// Dymanicall swap content on successfull form submission.
export const swapPages = (pages) => {
  let currentIndex = 0;

  const hasMotionDisabled = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  // Swap pages without animation if motion disabled in browser.
  if (hasMotionDisabled) {
    pages.forEach((page, index) =>
      page.classList.toggle('hidden', index === currentIndex),
    );
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

// Ensure all pages have the same height.
export const normalizePageHeight = (pages) => {
  // Get max. pages height.
  const maxHeight = pages.reduce((max, page) => {
    // Display all pages momentarily to compute initial heights.
    page.classList.remove('hidden');
    return Math.max(page.offsetHeight, max);
  }, 0);

  // Adjust page height.
  pages.forEach((page, index) => {
    // First copy reference prior to modifying the property to satisfy the linter.
    const pageCopy = page;
    pageCopy.style.minHeight = `${maxHeight}px`;
    // Hide back all pages except the current one.
    if (index !== 0) page.classList.add('hidden');
  });
};
