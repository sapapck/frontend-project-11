/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
import * as yup from 'yup';
import watcher from './view.js';

const validateUrl = (url, watchetState) => {
  const schema = yup.string().required().url().notOneOf(url);
  return schema.validate(url)
    .then(() => {
      watchetState.form.url = true;
    })
    .catch((err) => {
      watchetState.errors = true;
      console.log(err);
    });
};

const app = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    texbox: document.querySelector('.text-danger'),
  };

  const state = {
    form: {
      url: null,
    },
    errors: null,
  };

  const watchetState = watcher(state, elements);
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    validateUrl(url, watchetState);
  });
};
export default app;
