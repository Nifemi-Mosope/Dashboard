const { createStore, applyMiddleware } = require('redux');
const { composeWithDevTools } = require('redux-devtools-extension');
const logger = require('redux-logger').default;
const {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} = require('redux-persist');
const storage = require('redux-persist/lib/storage').default;
const autoMergeLevel1 = require('redux-persist/lib/stateReconciler/autoMergeLevel1').default;

const rootReducer = require('./root-reducer').default;

const middleware = [logger];

const persistConfig = {
  key: 'archintel',
  stateReconciler: autoMergeLevel1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  composeWithDevTools(
    applyMiddleware(...middleware),
    // other store enhancers if any
  )
);

const persistedStore = persistStore(store);

module.exports = {
  store,
  persistedStore,
};