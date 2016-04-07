import React from 'react';
import Li_link from '../../components/li_link';
import Sn from '../../components/sn';
import { connect } from 'react-redux';
import {fetchPosts} from '../../actions/home'
import {Link} from 'react-router';
import {tpl_form} from '../../actions/tpl'
import cx from 'classnames';

const Home = React.createClass({
  componentDidMount: function(){
      const {dispatch} = this.props;
      dispatch(fetchPosts('USER_INIT'));
  },
  render: function(){
      var user = this.props.propsValue.user;
      var user_descb = user.info.map(function(item, index){
          return (
                <p key={index}>{item.txt}</p>
              )
      });
      var links = this.props.propsValue.home.links;
      var dl = this.props.propsValue.home.dl;
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
                <div className="top">
                    <Sn/>
                </div>
                <Li_link links={links}/>
            </div>
            <div className="body clearfix">
                <div>
                    <div className="left_side left">
                        <dl>
                            {dl_list}
                        </dl>
                    </div>
                    <div className="left center_cont" id="example">
                        <div className="user_info">
                            <div className="info clearfix">
                                <div className="user_img left"></div>
                                <div className="user_descb right">
                                    { user_descb}
                                </div>
                            </div>
                            <div className="notices">

                            </div>
                        </div>
                        <section>
                            {this.props.children}
                        </section>
                    </div>
                    <div className="right right_side"></div>
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

export default connect(mapStateToProps)(Home);