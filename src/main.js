import * as utils from './js/utils';

const pages = [...document.querySelectorAll('.page-content')];
const form = document.querySelector('#rating-form');
const radioGroup = form.querySelector('[role="radiogroup"');
const radios = [...radioGroup.querySelectorAll("input[type='radio']")];
const btn = form.querySelector('button[type="submit"]');

const isValidationRequired = radios.some((radio) =>
  radio.hasAttribute('required'),
);

const validateForm = () =>
  new Promise((resolve, reject) => {
    if (isValidationRequired) {
      const { isValid } = utils.validateRadioGroup(radioGroup);
      if (!isValid) reject(Error('invalid form data'));
    }
    // Pretend its hitting the network.
    setTimeout(() => {
      resolve();
    }, 1000);
  });

const submitForm = (formData) => {
  const rating = formData.get('rating') ?? 'x';
  utils.swapPages(pages);
  pages[1].querySelector(`#selected-rating`).innerText = rating;
};

// Disable browser's built-in validation (done programatically to ensure browser validation can still occur if JavaScript is disabeld in the browser).
form.noValidate = true;

window.addEventListener('load', () => {
  // 1. Enable form controls (JavaScript enabled).
  radioGroup.disabled = false;
  btn.disabled = false;
  // 2. Ensure all pages have the same height.
  utils.normalizePageHeight(pages);
});

// Form submission with on submit custom data validation.
form.addEventListener('submit', async (e) => {
  try {
    e.preventDefault();
    // Retrieve form data prior to disabling form controls (otherwise form data will not be submitted!).
    const formData = new FormData(form);
    utils.updateFormStatus(e.target, utils.FORM_STATUS.submit);
    await validateForm();
    submitForm(formData);
  } catch (err) {
    utils.updateFormStatus(form, utils.FORM_STATUS.error);
  }
});

// Remove displayed error upon radio selection.
form.addEventListener('change', (e) => {
  if (!isValidationRequired || e.target.name !== 'rating') return;
  const radioStatus = utils.validateRadio(e.target);
  if (radioStatus.isValid) {
    utils.updateFeedback(radioGroup, radioStatus);
  }
});
