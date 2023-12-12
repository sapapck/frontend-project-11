/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */

import onChange from 'on-change';
import _ from 'lodash';

const watch = (state, elements, i18n) => {
  const renderPost = (posts) => {
    const divBorder = document.createElement('div');
    const divNameBody = document.createElement('div');
    const h2Title = document.createElement('h2');
    const ulContent = document.createElement('ul');

    divBorder.classList.add('card', 'border-0');
    divNameBody.classList.add('card-body');
    h2Title.classList.add('card-title', 'h4');
    h2Title.textContent = 'Посты';
    ulContent.classList.add('list-group', 'border-0', 'rounded-0');

    // state.listOfPosts
    return posts.forEach((post) => {
      const { id, link, title } = post;
      const li = document.createElement('li');
      const a = document.createElement('a');
      const button = document.createElement('button');

      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

      a.setAttribute('href', link.textContent);
      a.classList.add('fw-bold');
      a.setAttribute('data-id', id.textContent);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      a.textContent = title.textContent;

      button.setAttribute('type', 'button');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.setAttribute('data-id', id.textContent);
      button.setAttribute('data-bs-toggle', 'modal');
      button.setAttribute('data-bs-target', '#modal');
      button.textContent = 'Просмотр';

      divNameBody.append(h2Title);
      li.append(a, button);
      ulContent.append(li);
      divBorder.append(divNameBody, ulContent);
      return elements.posts.append(divBorder);
    });
  };

  const renderFeeds = (feeds) => {
    const { title, description } = feeds;

    const divBorder = document.createElement('div');
    const divNameBody = document.createElement('div');
    const h2Title = document.createElement('h2');
    const ulContent = document.createElement('ul');
    const li = document.createElement('li');
    const h3Title = document.createElement('h3');
    const pDescription = document.createElement('p');

    divBorder.classList.add('card', 'border-0');
    divNameBody.classList.add('card-body');
    h2Title.classList.add('card-title', 'h4');
    h2Title.textContent = 'Фиды';
    ulContent.classList.add('list-group', 'border-0', 'rounded-0');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    h3Title.classList.add('h6', 'm-0');
    h3Title.textContent = title;
    pDescription.classList.add('m-0', 'small', 'text-black-50');
    pDescription.textContent = description;

    divNameBody.append(h2Title);
    li.append(h3Title, pDescription);
    ulContent.append(li);
    divBorder.append(divNameBody, ulContent);
    return elements.feeds.append(divBorder);
  };

  const errorHandler = () => {
    elements.input.classList.add('is-invalid');
    elements.feedback.classList.add('text-danger');
    elements.feedback.textContent = i18n.t(state.validation.error);
  };

  const finishHandler = () => {
    elements.input.classList.remove('is-invalid');
    elements.feedback.classList.remove('text-danger');
    elements.feedback.classList.add('text-success');
    elements.feedback.textContent = i18n.t('loadSuccess');
    elements.input.focus();
    elements.form.reset();
  };

  const watchatState = onChange(state, (path, value) => {
    switch (path) {
      case 'processState':
        if (value === 'failed') {
          errorHandler();
        }
        if (value === 'finished') {
          finishHandler();
        }
        break;

      case 'validation.error':
        errorHandler(value);
        break;

      case 'listOfFeeds':
        renderFeeds(value);
        break;

      case 'listOfPosts':
        renderPost(value);
        break;

      default:
        break;
    }
  });
  return watchatState;
};
export default watch;
