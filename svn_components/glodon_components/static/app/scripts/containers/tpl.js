import React from 'react';
import { connect } from 'react-redux';
import {tpl_form, popContain, fetchDetail, fetchList}  from '../actions/tpl'
import cx from 'classnames';
import Form from '../components/form';

const Tpl = React.createClass({
  componentDidMount: function(){
//      const {dispatch} = this.props;
//      dispatch(tpl_form({
//          show: true
//      }));
  },
  cancel: function(){
      var _this = this;
      return function(){
           const {dispatch} = _this.props;
           dispatch(popContain());
           dispatch(tpl_form({
              show: false
          }));
      }
  },
  render: function(){
      var show = this.props.propsTplvalue.show;
      var contains = this.props.propsTplvalue.contains;
      var cancel = this.cancel;
      var _this = this;
      var tpl_inner = contains.map(function(item, index){
            switch(item.type){
                case 'form':
                    var inputs = item.inputs;
                    var invalid = item.invalid;
                    var action = item.action;
                    var addition = item.addition;
                    var name = item.name;
                    var refresh_url = item.refresh;
                    var belong = item.belong;
                    var params = item.params;
                    var buttons = item.buttons;
                    var refresh = function(_this, refresh_url, belong){
                        var __this = _this;
                        var _refresh_url = refresh_url;
                        return _refresh_url?function(){
                            const {dispatch} = __this.props;
                            if(belong){
                                if(belong=='detail'){
                                    dispatch(fetchDetail(_refresh_url))
                                }else{
                                    dispatch(fetchList(refresh_url, belong, params))
                                }
                            }
                            else{
                                return
                            }
                            dispatch(tpl_form({
                                show: false
                            }));
                            dispatch(popContain());
                        }:function(){}
                    }(_this, refresh_url, belong);
                    return(
                            <div className="tpl-form" key={index}>
                                <div className="modal-header">
                                    <button type="button" className="close right" onClick={cancel()}>×</button>
                                    <h4 className="modal-title">{name}</h4>
                                </div>
                                <Form inputs = {inputs} buttons={buttons} invalid = {invalid} method="post" action={action} addition={addition} refresh={refresh}/>
                            </div>
                        );
                default:
                    return (
                            <div key={index}></div>
                        )
            }
      });
      var tpl_classes= cx({
          'tpl': true,
          'show': show
      });
      return (
        <div className={tpl_classes}>
            <div className="inner">
                { tpl_inner }
            </div>
        </div>
      );
    }
});

function mapStateToProps(state) {
  return {
    propsTplvalue: state
  }
}

export default connect(mapStateToProps)(Tpl);