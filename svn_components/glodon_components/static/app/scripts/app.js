import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, IndexRoute, browserHistory, Redirect} from 'react-router';

import { Provider} from 'react-redux';

import Home from './containers/home/home'
import Home_rent from './containers/home/home_rent'
import Home_provide from './containers/home/home_provide'
import Home_return from './containers/home/home_return'
import Components from './containers/components/components'
import Components_add from './containers/components/components_add'
import Detail from './containers/detail'
import Orders from './containers/orders/orders'
import Users from './containers/users/users'
import Tpl from './containers/tpl'
import List from './containers/list'

import homeStore from './store/homestore'
import tplStore from './store/tplstore'



class Hello extends React.Component{
  render(){
          return (
              <Provider store={tplStore}>
                  <div className="full_alert">
                      <div className="alert">
                          <h1>Hello World!</h1>
                      </div>
                  </div>
              </Provider>
              )
      }
  }
;



class NotFound404 extends React.Component{
  render(){
          return (
              <div className="full_alert">
                  <div className="alert">
                      <h1>NotFound404!</h1>
                  </div>
              </div>
              )
      }
  }
;


ReactDOM.render(
        <Provider store={homeStore}>
	        <Router history={browserHistory}>
                <Route path="/app/home" component={Home}>
                    <Route path="rent" component={Home_rent}/>
                    <Route path="provide" component={Home_provide}/>
                    <Route path="return" component={Home_return}/>
                </Route>
                <Redirect from="/app/components" to="/app/components/list"/>
                <Route path="/app/components" component={Components}>
                    <Route path="list" component={List}/>
                    <Route path="add" component={Components_add}/>
                    <Route path="component/:id" component={Detail}/>
                    <Route path="rent" component={Home_rent}/>
                    <Route path="provide" component={Home_provide}/>
                    <Route path="return" component={Home_return}/>
                </Route>
                <Redirect from="/app/orders" to="/app/orders/list"/>
                <Route path="/app/orders" component={Orders}>
                    <Route path="list" component={List}/>
                    <Route path="order/:id" component={Hello}/>
                    <Route path="rent" component={Home_rent}/>
                    <Route path="provide" component={Home_provide}/>
                    <Route path="return" component={Home_return}/>
                </Route>
                <Redirect from="/app/users" to="/app/users/list"/>
                <Route path="/app/users" component={Users}>
                    <Route path="list" component={List}/>
                    <Route path="user/:id" component={Hello}/>
                    <Route path="rent" component={Home_rent}/>
                    <Route path="provide" component={Home_provide}/>
                    <Route path="return" component={Home_return}/>
                </Route>
                <Redirect from="/app" to="/app/home" />
                <Route path="*" component={NotFound404}>
                </Route>
	        </Router>
        </Provider>
	, document.getElementById('app')) ;

ReactDOM.render(
        <Provider store={tplStore}>
            <Tpl/>
        </Provider>
    , document.getElementById('tpl')
);