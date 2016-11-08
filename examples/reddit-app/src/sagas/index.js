import { take, put, call, fork, select } from 'redux-saga/effects';
import { reddit as redditApi } from 'hello-api';

import {
  requestPosts,
  receivePosts
} from '../actions';
import {
  selectedRedditSelector,
  postsByRedditSelector
} from '../reducers/selectors';

// subroutines
export function* fetchPosts(reddit) {
  yield put(requestPosts({reddit}));
  const posts = yield call(redditApi.fetchPosts, reddit);
  yield put(receivePosts({
    reddit,
    posts,
    receivedAt: Date.now()
  }));
}

// watchers
export function* invalidateReddit() {
  while (true) {
    const { payload: {reddit} } = yield take('INVALIDATE_REDDIT');
    yield call(fetchPosts, reddit);
  }
}

export function* nextRedditChange() {
  while (true) {
    const prevReddit = yield select(selectedRedditSelector);
    yield take('SELECT_REDDIT');

    const newReddit = yield select(selectedRedditSelector);
    const postsByReddit = yield select(postsByRedditSelector);
    if (prevReddit !== newReddit && !postsByReddit[newReddit])
      yield fork(fetchPosts, newReddit);
  }
}

// init
export function* startup() {
  const selectedReddit = yield select(selectedRedditSelector);
  yield fork(fetchPosts, selectedReddit);
}

// root saga
export default function* root() {
  yield fork(startup);
  yield fork(nextRedditChange);
  yield fork(invalidateReddit);
}
