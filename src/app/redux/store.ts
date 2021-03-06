const appConfig = require('../../../config/main');
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import getReducers from './reducers';
import { IStore } from './IStore';
import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-localstorage';
import filter from 'redux-storage-decorator-filter';
const createLogger = require('redux-logger');

export function configureStore(history, clientReducers: Redux.ReducersMapObject, clientMiddlewares: Redux.Middleware[], initialState?: IStore): Redux.Store<IStore> {

  let storeEngine = createEngine('state');
  storeEngine = filter(storeEngine, ['pref']);
  const storageMiddleware = storage.createMiddleware(storeEngine);
  const reducer = storage.reducer(getReducers(clientReducers));

  const middlewares: Redux.Middleware[] = [
    routerMiddleware(history),
    thunk,
    storageMiddleware,
    ...clientMiddlewares,
  ];

  /** Add Only Dev. Middlewares */
  if (appConfig.env !== 'production' && process.env.BROWSER) {
    const logger = createLogger();
    middlewares.push(logger);
  }

  const composeEnhancers = (appConfig.env !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  const store = createStore(reducer, initialState, composeEnhancers(
    applyMiddleware(...middlewares),
  ));

  if (appConfig.env === 'development' && (module as any).hot) {
    (module as any).hot.accept('./reducers', () => {
      store.replaceReducer((require('./reducers')));
    });
  }

  const load = storage.createLoader(storeEngine);
  load(store).catch(() => console.error('Failed to load previous state'));

  return store;
}
