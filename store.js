import { createStore, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import config from 'utils/config';
import rootReducer from './reducers';

const currEnv = config('current_env');

// const store = createStore(
//   rootReducer,
//   currEnv === 'LOCAL' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(applyMiddleware(thunk)) : applyMiddleware(thunk)
// );
const store = createStore(rootReducer, applyMiddleware(thunk));

const persistor = persistStore(store);

const getPersistor = () => persistor;
const getStore = () => store;
const getState = () => store.getState();

export {
  getStore,
  getState,
  getPersistor,
};

export default {
  getStore,
  getState,
  getPersistor,
};
