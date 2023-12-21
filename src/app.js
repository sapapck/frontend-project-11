/* eslint-disable no-shadow */
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
import _ from 'lodash';
import render from './render.js';
import resources from './locales/index.js';
import rssParser from './parser.js';

const httpRequest = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`);

const addFeeds = (feedId, title, description, watchedState) => {
  watchedState.listOfFeeds.push({ feedId, title, description });
};

const addPosts = (posts, watchedState) => {
  const result = posts.map((post) => ({
    id: _.uniqueId(),
    title: post.title,
    description: post.description,
    link: post.link,
  }));
  watchedState.listOfPosts = result.concat(watchedState.listOfPosts);
};
const updatePosts = (state) => {
  const addedPosts = state.listOfPosts.map((post) => post.link);
  httpRequest(state.data)
    .then((response) => rssParser(response.data.contents))
    .then((parsedRss) => {
      const { posts } = parsedRss;
      const newPosts = posts.map((post) => post.link);
      if (!addedPosts.includes(newPosts)) {
        addPosts(newPosts, state);
      }
    });     

};
const app = () => {

  const elements = {
    modalHeader: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalFooter: document.querySelector('.full-article'),
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
    clickedPost: [],
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
          .then((validUrl) => { 
            const req = httpRequest(validUrl);
            console.log();
            return req;
          })
          .then((rssData) => {
            const par = rssParser(rssData.data.contents); 
            return par;
          })
          .then((parsedRSS) => {
            const feedId = _.uniqueId();
            const feedTitle = parsedRSS.feed.channelTitle;
            const feedDescription = parsedRSS.feed.channelDescription;

            const { posts } = parsedRSS;

            addFeeds(feedId, feedTitle, feedDescription, watchedState);
            addPosts(posts, watchedState);

            watchedState.validation.state = 'valid';
            watchedState.processState = 'sending';
            watchedState.listOfFeeds.push(state.data);
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
