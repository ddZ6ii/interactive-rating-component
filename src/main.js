const form = document.querySelector('#rating-form');
const btn = document.querySelector('button[type="submit"]');
const radios = [...form.querySelectorAll("input[type='radio']")];
const pages = [...document.querySelectorAll('.page-content')];

// Check if validation is required.
const isValidationRequired = radios.some((radio) =>
  radio.hasAttribute('required'),
);

// Utility functions
const focusRadioById = (radioId) => form.querySelector(`${radioId}`).focus();
const validateRadioByName = (radioName) => {
  const selection =
    form.querySelector(`input[name=${radioName}]:checked`)?.value ?? '';
  const isValid = selection.length !== 0;
  return {
    isValid,
    errorMessage: isValid ? '' : 'Please select a rating to continue.',
  };
};
const updateFeedback = (nodeId, status) => {
  const errorEl = form.querySelector(`${nodeId}`);
  // Update error message.
  errorEl.querySelector(`${nodeId}-message`).innerText = status.errorMessage;
  // Update error visibility.
  errorEl.classList.toggle('hidden', status.isValid);
  // Update submit button state.
  btn.toggleAttribute('disabled', !status.isValid);
};
const validateForm = (e) =>
  new Promise((resolve, reject) => {
    if (isValidationRequired) {
      // 1. Prevent form submission.
      e.preventDefault();

      // 2. Validate radio input.
      const radioStatus = validateRadioByName('rating');

      // 3. Update UI.
      updateFeedback('#rating-error', radioStatus);

      // 4. Reject promise if invalid data.
      if (!radioStatus.isValid) {
        reject(Error('invalid form data'));
        return;
      }
    }

    // Return form data.
    const rating = new FormData(form).get('rating') ?? 'x';
    resolve(rating);

    // !TO DO: disable btn
  });
const submitForm = (rating) => {
  // Reset form.
  form.reset();

  // !TO DO: make sure all page have the same height
  // const pageHeights = pages.map((page) => page.offsetHeight);
  // const maxHeight = Math.max(...pageHeights);
  // console.log(pages[0].offsetHeight);
  // console.log(pages[1].offsetHeight);
  // console.log(pageHeights);
  // console.log(maxHeight);

  // Switch page display on screen.
  pages[0].classList.add('hidden');
  pages[1].classList.remove('hidden');

  // !TO DO:dd class 'fade-in' to next page
  // !Adjust height if need be
  // const nextPageHeight = pages[1].offsetHeight;
  // if (nextPageHeight < currentPageHeight) {
  //   pages[1].style.minHeight = currentPageHeight;
  // }

  // Update UI with selected rating.
  pages[1].querySelector('#selected-rating').innerText = rating;
};

// Discard browser built-in validation.
form.setAttribute('novalidate', '');

// Handle submission process with custom form data validation (verify input on submit).
form.addEventListener('submit', async (e) => {
  try {
    const rating = await validateForm(e);
    submitForm(rating);
  } catch (err) {
    // Invalid form data -> focus radio input
    focusRadioById('#rating-5');
  }
});

// Update form errors and submit button state (live).
form.addEventListener('change', (e) => {
  if (!isValidationRequired || e.target.name !== 'rating') return;
  const radioStatus = validateRadioByName(e.target.name);
  if (radioStatus.isValid) {
    updateFeedback('#rating-error', radioStatus);
  }
});
