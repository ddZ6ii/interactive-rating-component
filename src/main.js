import * as utils from './js/utils';

const RADIO_NAME = 'rating';
const form = document.querySelector('#rating-form');
const radios = [...form.querySelectorAll("input[type='radio']")];
const pages = [...document.querySelectorAll('.page-content')];

// Check if validation is required.
const isValidationRequired = radios.some((radio) =>
  radio.hasAttribute('required'),
);

// Ensure all pages have the same height.
window.addEventListener('load', () => {
  // Get max. pages height.
  const maxHeight = pages.reduce((max, page) => {
    // Display all pages momentarily.
    page.classList.remove('hidden');
    return Math.max(page.offsetHeight, max);
  }, 0);

  // Adjust page height.
  pages.forEach((page, index) => {
    // Fisrt copy by reference prior to modifying the property to satisfy the linter.
    const pageCopy = page;
    pageCopy.style.minHeight = `${maxHeight}px`;
    // Hide back all pages except the current one.
    if (index !== 0) page.classList.add('hidden');
  });
});

// Discard browser built-in validation.
form.setAttribute('novalidate', '');

// Handle submission process with custom form data validation (verify input on submit).
form.addEventListener('submit', async (evt) => {
  const validateForm = (e) =>
    new Promise((resolve, reject) => {
      if (isValidationRequired) {
        // 1. Prevent form submission.
        e.preventDefault();

        // 2. Validate radio input.
        const radioStatus = utils.validateRadioByName(`${RADIO_NAME}`);

        // 3. Update UI.
        utils.updateFeedback(`#${RADIO_NAME}-error`, radioStatus);

        // 4. Reject promise if invalid data.
        if (!radioStatus.isValid) {
          reject(Error('invalid form data'));
          return;
        }
      }

      // Return form data.
      const rating = new FormData(form).get(`${RADIO_NAME}`) ?? 'x';
      resolve(rating);
    });

  const submitForm = (rating) => {
    // 1. Reset form.
    form.reset();

    // 2. Switch page display on screen.
    utils.swapPages(pages);

    // 3. Update UI with selected rating.
    pages[1].querySelector(`#selected-${RADIO_NAME}`).innerText = rating;
  };

  try {
    const rating = await validateForm(evt);
    submitForm(rating);
  } catch (err) {
    // Invalid form data -> focus radio input
    utils.focusRadioById(`#${RADIO_NAME}-5`);
  }
});

// Update form errors and submit button state (live).
form.addEventListener('change', (e) => {
  if (!isValidationRequired || e.target.name !== `${RADIO_NAME}`) return;
  const radioStatus = utils.validateRadioByName(e.target.name);
  if (radioStatus.isValid) {
    utils.updateFeedback(`#${RADIO_NAME}-error`, radioStatus);
  }
});
