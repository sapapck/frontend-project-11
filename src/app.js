/* eslint-disable no-restricted-syntax */
/* eslint-disable padded-blocks */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import onChange from 'on-change';
import render from './view.js';
import resources from './locales/index.js';

const httpResponse = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`);

const generateId = (state) => {
  const feeds = state.listOfFeeds;
  let count = 0;
  feeds.forEach((feed) => {
    count += 1;
    feed.id = count;
  });
  return feeds;
};

const app = () => {

  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    feedback: document.querySelector('.feedback'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
  };
  
  const state = {
    processState: 'filling',
    data: '',
    validation: {
      state: 'valid',
      error: '',
    },
    listOfPosts: [],
    listOfFeeds: [],
  };

  const i18nI = i18next.createInstance();
  i18nI.init({
    lng: 'ru',
    debug: false,
    resources,
  })
    .then(() => {
      yup.setLocale({
        mixed: {
          notOneOf: 'errors.alreadyExists',
          default: 'the entered data is not valid',
        },
        string: {
          url: 'errors.invalidUrl',
        },
      });

      const watchedState = onChange(state, render(state, elements, i18nI));

      elements.form.addEventListener('input', (e) => {
        e.preventDefault();
        watchedState.data = e.target.value;
      });

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();

        const schema = yup.string().url().notOneOf(state.listOfFeeds).trim();
        schema.validate(state.data)
          .then(() => {
            watchedState.validation.state = 'valid';
            watchedState.processState = 'sending';
            watchedState.listOfFeeds.push(state.data);
            console.log(state.listOfFeeds);
            watchedState.processState = 'finished';
          })
          .catch((err) => {
            watchedState.validation.state = 'invalid';
            watchedState.validation.error = err.message;
            watchedState.processState = 'failed';
          })
          .finally(() => {
            watchedState.processState = 'filling';
          });
      });
    });
};
export default app;
