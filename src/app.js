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
import { get, uniqueId } from 'lodash';
import render from './render.js';
import resources from './locales/index.js';
import rssParser from './parser.js';

const app = () => {

  const defaultLng = 'ru';

  const elements = {
    modal: document.getElementById('modal'),
    modalHeader: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalFooter: document.querySelector('.full-article'),
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    feedback: document.querySelector('.feedback'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
    button: document.querySelector('button[type="submit"]'),
  };
  
  const state = {
    processState: 'filling',
    data: '',

    uiState: {
      PreviewedPosts: new Set(),
    },
    validation: {
      state: 'valid',
      error: '',
    },
    content: {
      posts: [],
      feeds: [],
    },
    
  };

  const getAxiosResponse = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`);

  const createPosts = (state, newPosts, feedId) => { 
    const preparedPosts = newPosts.map((post) => ({
      ...post,
      feedId,
      id: uniqueId(),
    }));
    state.content.posts.unshift(...preparedPosts);
  };
  
  const getNewPosts = (state) => {
    const timeout = 5000;
    const promises = state.content.feeds
      .map(({ link, feedId }) => getAxiosResponse(link)
        .then((response) => {
          const { posts } = rssParser(response.data.contents);
          const addedPosts = state.content.posts.map((post) => post.link);
          const newPosts = posts.filter((post) => !addedPosts.includes(post.link));
          if (newPosts.length > 0) {
            createPosts(state, newPosts, feedId);
          }
          return Promise.resolve();
        }));
  
    Promise.allSettled(promises)
      .finally(() => {
        setTimeout(() => getNewPosts(state), timeout);
      });
  };

  const i18nI = i18next.createInstance();
  i18nI.init({
    lng: defaultLng,
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
        watchedState.processState = 'sending';
        const url = state.content.feeds.map((feed) => feed.link);
        const schema = yup.string().url().notOneOf(url).trim();
        schema.validate(state.data)

          .then((validUrl) => getAxiosResponse(validUrl))

          .then((rssData) => rssParser(rssData.data.contents))

          .then((parsedRSS) => {
            watchedState.validation.state = 'valid';

            const feedId = uniqueId();
            const { posts, feed } = parsedRSS;
            createPosts(watchedState, posts, feedId);
            watchedState.content.feeds.push({ ...feed, feedId, link: state.data });
            watchedState.processState = 'finished';
            getNewPosts(watchedState);
          })
          .catch((err) => {
            watchedState.validation.state = 'invalid';
            
            watchedState.validation.error = err;
            watchedState.processState = 'failed';
          })
          .finally(() => {
            watchedState.processState = 'filling';
          });
      });

      elements.posts.addEventListener('click', (e) => {
        const idPost = e.target.dataset.id;
        if (idPost) {
          const selectPost = watchedState.content.posts.find((post) => post.id === idPost);
          if (selectPost) {
            watchedState.uiState.PreviewedPosts.add(selectPost);
          }
        }
      });
      
    });
    
};
export default app;
