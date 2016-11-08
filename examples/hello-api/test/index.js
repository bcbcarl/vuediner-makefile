import test from 'tape-promise/tape';
import fetchMock from 'fetch-mock';

import { reddit } from '../dist/release';

const reddit1 = {
  "domain": "self.vuejs",
  "subreddit": "vuejs",
  "id": "5bmojs",
  "author": "Patrick-1Broker",
  "permalink": "/r/vuejs/comments/5bmojs/we_rewrote_a_popular_trading_platform_with_vue_ama/",
  "url": "https://www.reddit.com/r/vuejs/comments/5bmojs/we_rewrote_a_popular_trading_platform_with_vue_ama/",
  "title": "We rewrote a popular trading platform with Vue. AMA!",
  "created_utc": 1478531894,
  "num_comments": 23
};

const reddit2 = {
  "domain": "youtube.com",
  "subreddit": "vuejs",
  "id": "5blric",
  "author": "Castemson",
  "permalink": "/r/vuejs/comments/5blric/how_to_use_vuejs_instead_of_jquery_for_a/",
  "url": "https://www.youtube.com/watch?v=PZ5pYNWZLJo",
  "title": "How to use Vue.js instead of jQuery for a Bootstrap project",
  "created_utc": 1478520029,
  "num_comments": 0
};

test('reddit #fetchPosts', (t) => {
  const mockResponse = {
    data: {
      children: [{ data: reddit1 }, { data: reddit2 }]
    }
  };

  fetchMock.get('http://www.reddit.com/r/vuejs.json', mockResponse);
  return reddit.fetchPosts('vuejs')
    .then((posts) => {
      t.deepEqual(posts, [reddit1, reddit2], 'should fetch "vuejs" reddits');
      fetchMock.restore();
    });
});
