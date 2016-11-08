import test from 'tape';
import { useFakeTimers } from 'sinon';
import { call, fork, put, select, take } from 'redux-saga/effects';

import {
  fetchPosts,
  fetchPostsApi,
  invalidateReddit,
  nextRedditChange,
  startup
} from '../src/sagas';
import {
  requestPosts,
  receivePosts
} from '../src/actions';
import {
  postsByRedditSelector,
  selectedRedditSelector
} from '../src/reducers/selectors';

test('fetchPosts Saga', (t) => {
  const posts = [1, 2, 3];
  const reddit = 'react_reddit';
  const generator = fetchPosts(reddit);
  const clock = useFakeTimers(Date.now());
  t.deepEqual(
    generator.next().value,
    put(requestPosts({reddit})),
    'must dispatch a requestPosts action'
  );
  t.deepEqual(
    generator.next().value,
    call(fetchPostsApi, reddit),
    'must call fetchPostsApi with reddit name'
  );
  t.deepEqual(
    generator.next(posts).value,
    put(receivePosts({
      reddit,
      posts,
      receivedAt: Date.now()
    })),
    'must dispatch a receivePosts action with posts'
  );
  clock.restore();
  t.ok(generator.next().done, 'must finish');
  t.end();
});

test('invalidateReddit Saga', (t) => {
  const generator = invalidateReddit();
  t.deepEqual(
    generator.next().value,
    take('INVALIDATE_REDDIT'),
    'must take a SELECT_REDDIT action'
  );
  t.deepEqual(
    generator.next({
      payload: {
        reddit: 'new_reddit_1'
      }
    }).value,
    call(fetchPosts, 'new_reddit_1'),
    'must call fetchPosts with new reddit'
  );
  t.deepEqual(
    generator.next().value,
    take('INVALIDATE_REDDIT'),
    'must go back to beginning of loop'
  );
  t.end();
});

test('nextRedditChange Saga when switching to new reddit', (t) => {
  const generator = nextRedditChange();
  t.deepEqual(
    generator.next().value,
    select(selectedRedditSelector),
    'must select current reddit from store'
  );
  t.deepEqual(
    generator.next('prev_reddit').value,
    take('SELECT_REDDIT'),
    'must take a SELECT_REDDIT action'
  );
  t.deepEqual(
    generator.next().value,
    select(selectedRedditSelector),
    'must select newly selected reddit from store'
  );
  t.deepEqual(
    generator.next('new_reddit').value,
    select(postsByRedditSelector),
    'must select posts by reddit from store'
  );
  t.deepEqual(
    generator.next({}).value,
    fork(fetchPosts, 'new_reddit'),
    'delegate to fetchPosts for new reddit\'s posts'
  );
  t.deepEqual(
    generator.next().value,
    select(selectedRedditSelector),
    'must go back to beginning of loop'
  );
  t.end();
});

test('nextRedditChange Saga when same reddit is selected', (t) => {
  const generator = nextRedditChange();
  generator.next();
  generator.next('prev_reddit');
  generator.next();
  generator.next('prev_reddit');
  t.deepEqual(
    generator.next().value,
    select(selectedRedditSelector),
    'must go back to beginning of loop'
  );
  t.end();
});

test('nextRedditChange Saga when posts were previously loaded', (t) => {
  const generator = nextRedditChange();
  generator.next();
  generator.next('prev_reddit');
  generator.next();
  generator.next('new_reddit');
  const postsByReddit = {
    'new_reddit': ['cached_post']
  };
  t.deepEqual(
    generator.next(postsByReddit).value,
    select(selectedRedditSelector),
    'must go back to beginning of loop'
  );
  t.end();
});

test('startup Saga', (t) => {
  const generator = startup();
  t.deepEqual(
    generator.next().value,
    select(selectedRedditSelector),
    'gets currently selected reddit'
  );
  t.deepEqual(
    generator.next('selected_reddit').value,
    fork(fetchPosts, 'selected_reddit'),
    'delegates to fetchPosts to get posts'
  );
  t.ok(generator.next().done, 'must finish');
  t.end();
});
