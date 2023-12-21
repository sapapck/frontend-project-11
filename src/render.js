/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-extraneous-dependencies */

const makeContainer = (name, state, elements, i18n) => {
  elements[name].textContent = '';
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18n.t(name);
  cardBody.append(cardTitle);
  card.append(cardBody);
  elements[name].append(card);
  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');
  if (name === 'feeds') {
    state.listOfFeeds.forEach((feed) => {
      const { title, description } = feed;

      const listGroupItem = document.createElement('li');
      listGroupItem.classList.add('list-group-item', 'border-0', 'border-end-0');
      const h3 = document.createElement('h3');
      h3.classList.add('h6', 'm-0');
      h3.textContent = title;
      const p = document.createElement('p');
      p.classList.add('m-0', 'small', 'text-black-50');
      p.textContent = description;

      listGroupItem.append(h3, p);
      listGroup.prepend(listGroupItem);
    });
    card.append(listGroup);
  }
  if (name === 'posts') {
    state.listOfPosts.forEach((post) => {
      const {
 id, title, link, description,
} = post;
      const listGroupItem = document.createElement('li');
      listGroupItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

      const a = document.createElement('a');
      a.classList.add('fw-bold');
      a.setAttribute('data-id', id);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      a.setAttribute('href', link);
      a.textContent = title;

      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.setAttribute('data-id', id);
      button.setAttribute('data-bs-Toggle', 'modal');
      button.setAttribute('data-bs-Target', '#modal');
      button.textContent = 'Просмотр';

      elements.modalHeader.textContent = title;
      elements.modalBody.textContent = description;
      elements.modalFooter.setAttribute('href', link);

      listGroupItem.append(a, button);
      listGroup.append(listGroupItem);
    });
    card.append(listGroup);
  }
};

const modalContent = (elements, posts) => {
  posts.forEach((post) => {
    const { title, link, description } = post;

    elements.modalHeader.textContent = title;
      elements.modalBody.textContent = description;
      elements.modalFooter.setAttribute('href', link);
  });
};

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
    case 'listOfFeeds':
      makeContainer('feeds', state, elements, i18n);
      break;
    case 'listOfPosts':
      makeContainer('posts', state, elements, i18n);
      break;
    default:
      break;
  }
};
export default render;
