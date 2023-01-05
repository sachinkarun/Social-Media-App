import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducer/rootReducer';

const middleware = [thunk];

export const store = createStore(rootReducer, applyMiddleware(...middleware));
