const rssParser = (rssData) => {
  const parser = new DOMParser();
  const xmlDocument = parser.parseFromString(rssData, 'application/xml');

  const channel = xmlDocument.querySelector('channel');
  const feedTitle = xmlDocument.querySelector('channel title').textContent;
  const feedDescription = xmlDocument.querySelector('channel description').textContent;
  const feed = { feedTitle, feedDescription };

  const itemElements = channel.getElementsByTagName('item');
  const posts = [...itemElements].map((item) => {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('channel link').textContent;
    return {
      title,
      description,
      link,
    };
  });
  const parsedRSS = { feed, posts };

  return Promise.resolve(parsedRSS);
};

export default rssParser;
