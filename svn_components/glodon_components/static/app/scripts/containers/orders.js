import React from 'react';
import Li_link from '../components/li_link';
import { connect } from 'react-redux';
import * as action from '../actions/home'
import {Link} from 'react-router';

const Orders = React.createClass({
  componentDidMount: function(){
      this.props.fetchPosts('USER_INIT');
  },
  render: function(){
      var links = this.props.propsValue.home.links;
      var dl = this.props.propsValue.orders.dl;
      var dl_list = dl.map(function(item, index){
          return (
                item.type=='dt'?<dt key={index}>{item.txt}</dt>:<dd key={index}>
                    <Link  to={item.hash} activeClassName="active" className="clearfix">{item.txt}</Link>
                </dd>
              )
      });
      return (
        <div>
            <div className="header">
                <div className="top"></div>
                <Li_link links={links}/>
            </div>
            <div className="body clearfix">
                <div>
                    <div className="left_side left">
                        <dl>
                            {dl_list}
                        </dl>
                    </div>
                    <div className="left center_manage" id="example">
                        <section>
                            {this.props.children}
                        </section>
                    </div>
                </div>
            </div>
        </div>
      );
    }
});

function mapStateToProps(state) {
  return {
    propsValue: state
  }
}

export default connect(mapStateToProps, action)(Orders);