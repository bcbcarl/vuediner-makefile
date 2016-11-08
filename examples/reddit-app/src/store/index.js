import { merge } from 'ramda';
import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../reducers';
import sagaMonitor from '../saga-monitor';

const sagaMiddleware = createSagaMiddleware({ sagaMonitor });

const prodStore = (sagaMiddleware) => merge(
  createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware)
  ),
  { runSaga: sagaMiddleware.run });

const devStore = (sagaMiddleware) => merge(
  createStore(
    rootReducer,
    compose(
      applyMiddleware(sagaMiddleware),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  ),
  { runSaga: sagaMiddleware.run });

const configureStore = () => {
  if (process.env.NODE_ENV !== 'production') {
    return devStore(sagaMiddleware);
  }
  return prodStore(sagaMiddleware);
}

export default configureStore;
