import React from 'react'
import { Provider, connect} from 'react-redux'
import tplStore from '../store/tplstore'
import Component_detail from './components/component_detail'
import {fetchPosts} from '../actions/home'

class Detail extends React.Component{
  render(){
          var params = this.props.params;
          var user = this.props.propsValue.user;
          var component = (
                    <Component_detail params={params} isAdmin={user.isAdmin} user_id={user.user_id}/>
              );
          return (
              <Provider store={tplStore}>
                {component}
              </Provider>
              )
      }
  }
;

function mapStateToProps(state) {
  return {
    propsValue: state
  }
}

export default connect(mapStateToProps)(Detail);