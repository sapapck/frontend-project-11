/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */

const errorHandler = (elements, error, i18n) => {
  elements.input.classList.add('is-invalid');
  elements.feedback.classList.add('text-danger');
  elements.feedback.textContent = i18n.t(error);
};

const finishHandler = (elements, i18n) => {
  elements.input.classList.remove('is-invalid');
  elements.feedback.classList.remove('text-danger');
  elements.feedback.classList.add('text-success');
  elements.feedback.textContent = i18n.t('loadSuccess');
  // сделал для отладки кода
  // const div = document.createElement('div');
  // div.textContent = 'feeds';
  // elements.feeds.append(div);
  elements.input.focus();
  elements.form.reset();
};

const render = (state, elements, i18n) => (path, value) => {
  switch (path) {
    case 'processState':
      if (value === 'failed') {
        errorHandler(elements, state.validation.error, i18n);
      }
      if (value === 'finished') {
        finishHandler(elements, i18n);
      }
      break;

    default:
      break;
  }
};
export default render;
