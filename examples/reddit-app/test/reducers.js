import test from 'tape';
import { useFakeTimers } from 'sinon';

import reducer from '../src/reducers/index';

test('requestPosts Reducer', (t) => {
  const { type, payload } = {
    type: 'REQUEST_POSTS',
    payload: {
      reddit: 'vuejs'
    }
  };
  const { reddit } = payload;
  const expected = {
    postsByReddit: {
      [reddit]: {
        isFetching: true,
        items: []
      }
    },
    selectedReddit: reddit
  };
  t.deepEqual(
    reducer(undefined, { type, payload }),
    expected,
    'must dispatch a requestPosts action'
  );
  t.end();
});

test('receivePosts Reducer', (t) => {
  const clock = useFakeTimers(Date.now());
  const { type, payload } = {
    type: 'RECEIVE_POSTS',
    payload: {
      reddit: 'vuejs',
      posts: [1, 2, 3],
      receivedAt: Date.now()
    }
  };
  const { reddit, posts, receivedAt } = payload;
  const expected = {
    postsByReddit: {
      [reddit]: {
        isFetching: false,
        items: posts,
        lastUpdated: receivedAt
      }
    },
    selectedReddit: reddit
  };
  t.deepEqual(
    reducer(undefined, { type, payload }),
    expected,
    'must dispatch a receivePosts action'
  );
  clock.restore();
  t.end();
});

test('selectedReddit Reducer', (t) => {
  const { type, payload } = {
    type: 'SELECT_REDDIT',
    payload: {
      reddit: 'vuejs'
    }
  };
  const { reddit } = payload;
  const expected = {
    postsByReddit: {},
    selectedReddit: reddit
  };
  t.deepEqual(
    reducer(undefined, { type, payload }),
    expected,
    'must dispatch a selectedReddit action'
  );
  t.end();
});

test('invalidateReddit Reducer', (t) => {
  const { type, payload } = {
    type: 'INVALIDATE_REDDIT',
    payload: {
      reddit: 'vuejs'
    }
  };
  const { reddit } = payload;
  const expected = {
    postsByReddit: {},
    selectedReddit: reddit
  };
  t.deepEqual(
    reducer(undefined, { type, payload }),
    expected,
    'must dispatch an invalidateReddit action'
  );
  t.end();
});
