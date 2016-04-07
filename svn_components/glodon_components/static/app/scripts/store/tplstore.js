import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import tplRedu from '../reducers/tpl'

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
)(createStore);

export default createStoreWithMiddleware(tplRedu);