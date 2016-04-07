import React from 'react';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import {appendContain, tpl_form, fetchDetail} from '../../actions/tpl';
import tplStore from '../../store/tplstore'
import cx from 'classnames';
import {provide_inputs, rent_inputs, return_inputs} from '../../const/shortcut_forms'


class Components_detail extends React.Component{
    constructor(props) {
        super(props);
        this.state = {detail: {}};
    }
    componentDidMount(){
        if(this.props.params.id){
            const {dispatch} = this.props;
            dispatch(fetchDetail('/project/component/' + this.props.params.id + '/detail'));
        }
    }
  provide(){
        var _this = this;
        var inputs = provide_inputs();
        return function(){
            const {dispatch} = _this.props;
              dispatch(tpl_form({
                  show: true
              }));
            var addition = [{
              key: 'operator_id',
              val:_this.props.user_id
            },
            {
              key: _this.props.propsValue.detail.type=='consumable'?'id':'sno',
              val: _this.props.propsValue.detail.type=='consumable'?_this.props.propsValue.detail.id:_this.props.propsValue.detail.sno
            }];
            if(_this.props.propsValue.detail.type=='normal'){
                inputs[2].disabled = true;
                inputs[2].default = 1;
                inputs[2].val = 1;
            }
            dispatch(appendContain({type: 'form', belong: 'detail',inputs: inputs, action: '/admin/provide_component', addition: addition, name: '领用配件', refresh: '/project/component/' + _this.props.params.id + '/detail'}));
        }
  }
  rent(){
        var _this = this;
        var inputs = rent_inputs();
        return function(){
            const {dispatch} = _this.props;
              dispatch(tpl_form({
                  show: true
              }));
            var addition = [{
              key: 'operator_id',
              val:_this.props.user_id
            },
            {
              key: _this.props.propsValue.detail.type=='consumable'?'id':'sno',
              val: _this.props.propsValue.detail.type=='consumable'?_this.props.propsValue.detail.id:_this.props.propsValue.detail.sno
            }];
            if(_this.props.propsValue.detail.type=='normal'){
                inputs[2].disabled = true;
                inputs[2].default = 1;
                inputs[2].val = 1;
            }
            dispatch(appendContain({type: 'form', belong: 'detail',inputs: inputs, action: '/admin/rent_component', addition: addition, name: '租用配件', refresh: '/project/component/' + _this.props.params.id + '/detail'}));
        }
  }
  return_compoment(){
        var _this = this;
        var inputs = return_inputs();
        return function(){
            const {dispatch} = _this.props;
              dispatch(tpl_form({
                  show: true
              }));
            var addition = [{
              key: 'operator_id',
              val:_this.props.user_id
            },
            {
              key: _this.props.propsValue.detail.type=='consumable'?'id':'sno',
              val: _this.props.propsValue.detail.type=='consumable'?_this.props.propsValue.detail.id:_this.props.propsValue.detail.sno
            }];
            if(_this.props.propsValue.detail.type=='normal'){
                inputs[2].disabled = true;
                inputs[2].default = 1;
                inputs[2].val = 1;
            }
            dispatch(appendContain({type: 'form', belong: 'detail',inputs: inputs, action: '/admin/return_component', addition: addition, name: '归还配件', refresh: '/project/component/' + _this.props.params.id + '/detail'}));
        }
  }
  render(){
          var detail = this.props.propsValue.detail || {};
          var isloading = this.props.propsValue.detail.isloading;
          var detail_classes= cx({
            'component-detail': true,
            'isloading': this.props.propsValue.detail.isloading
          });
          var provide_cx = cx({
                'disabled': !(detail.status=='空闲中' && (detail.use_for == 'provide' || detail.use_for == 'provide_and_rent'))
         });
          var rent_cx = cx({
                'disabled': !(detail.status=='空闲中' && (detail.use_for == 'rent' || detail.use_for == 'provide_and_rent'))
          });
          var return_cx = cx({
                'disabled': (detail.status=='空闲中' || detail.status=='已损坏')
          });
          var admin_fuc = (
          this.props.isAdmin?
              <div className="btn-group clearfix">
                  <button className={return_cx} disabled={ detail.status=='空闲中' || detail.status=='已损坏' || isloading} onClick={this.return_compoment()}>归还</button>
              </div>
              :
              <div className="btn-group clearfix">
              </div>
          );
          var normal_fuc = (
              this.props.isAdmin?<div className="btn-group clearfix">
                  <button className={provide_cx} disabled= {!(detail.status=='空闲中' && (detail.use_for == 'provide' || detail.use_for == 'provide_and_rent')) || isloading} onClick={this.provide()}>领用</button>
                  <button className={rent_cx} disabled= {!(detail.status=='空闲中' && (detail.use_for == 'rent' || detail.use_for == 'provide_and_rent')) || isloading} onClick={this.rent()}>租用</button>
              </div>
              :
              <div className="btn-group clearfix">
              </div>
          );
          return (
              (!detail.isloading)?<div className={detail_classes}>
                  <div className="detail-inner">
                      <div className="detail-info clearfix">
                          <div className="pic-box">
                              <div className="galley">
                                  <img/>
                              </div>
                              {normal_fuc}
                              { admin_fuc }
                          </div>
                          <div className="info-table">
                              <div className="title">
                                  <span>
                                      {detail.model}{detail.name}
                                  </span>
                              </div>
                              <div className="info-box">
                                  <dl className="clear-after">
                                      <dt className="label">
                                          费用
                                      </dt>
                                      <dd className="txt">
                                          1
                                      </dd>
                                  </dl>
                                  <dl className="clear-after">
                                      <dt className="label">
                                          归属
                                      </dt>
                                      <dd className="txt">
                                        {detail.zone}
                                      </dd>
                                  </dl>
                                  <dl className="clear-after">
                                      <dt className="label">
                                          状态
                                      </dt>
                                      <dd className="txt">
                                          {detail.status}
                                      </dd>
                                  </dl>
                                  <dl className="clear-after">
                                      <dt className="label">
                                          数量
                                      </dt>
                                      <dd className="txt">
                                          <span>库存{detail.total_number}件</span>
                                      </dd>
                                  </dl>
                              </div>
                              <div className="info-box">
                                  <ul className="clearfix">
                                      <li className="active">
                                          配件描述
                                      </li>
                                      <li>
                                          配件详情
                                      </li>
                                      <li>
                                          历史详情
                                      </li>
                                  </ul>
                                  <div className="descriptions">
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>:<div></div>
              )
      }
  }

function mapStateToProps(state) {
  return {
    propsValue: state
  }
}

export default connect(mapStateToProps)(Components_detail);