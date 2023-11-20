/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */
import onChange from 'on-change';

const renderValid = (elements) => {
  elements.form.reset();
  elements.input.focus();
};

const renderErrors = (elements) => {
  elements.textBox.textContent = 'error';
  elements.input.classList.add('is-invalid');
};

const watcher = (state, elements) => {
  const watchetState = onChange(state, (path) => {
    switch (path) {
      case 'form.url': return renderValid(elements);
      case 'form.errors': return renderErrors(elements);
      default: return undefined;
    }
  });
  return watchetState;
};
export default watcher;
