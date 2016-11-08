import { createAction } from 'redux-actions';

export const selectReddit = createAction('SELECT_REDDIT');
export const invalidateReddit = createAction('INVALIDATE_REDDIT');
export const requestPosts = createAction('REQUEST_POSTS');
export const receivePosts = createAction('RECEIVE_POSTS');
