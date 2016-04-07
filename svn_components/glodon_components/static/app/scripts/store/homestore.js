import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import homeRedu from '../reducers/home'

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
)(createStore);

export default createStoreWithMiddleware(homeRedu);