import { merge, repeat, zipObj } from 'ramda';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

const selectedReddit = handleActions({
  SELECT_REDDIT: (state, action) =>
    action.payload.reddit
}, 'vuejs');

const posts = handleActions({
  REQUEST_POSTS: (state, action) =>
    merge(state, {
      isFetching: true
    }),
  RECEIVE_POSTS: (state, action) =>
    merge(state, {
      isFetching: false,
      items: action.payload.posts,
      lastUpdated: action.payload.receivedAt
    })
}, {
    isFetching: false,
    items: []
  });

const postsByReddit = handleActions(zipObj(
  ['RECEIVE_POSTS', 'REQUEST_POSTS'],
  repeat((state, action) => {
    const { payload: {reddit} } = action;
    return merge(state, {
      [reddit]: posts(state[reddit], action)
    });
  }, 2)
), {});

const rootReducer = combineReducers({
  postsByReddit,
  selectedReddit
});

export default rootReducer;
