import React from 'react';
import { connect } from 'react-redux';
import { Provider} from 'react-redux';
import tplStore from '../store/tplstore'
import Search_panel from './search_panel'
import {setZones} from '../actions/home'
import Items from '../components/items'
import Table from '../components/table'

class List extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            zones: [],
            isloading: true,
            msg: '加载中...'}
    }
    componentDidMount(){
        var _this = this;
        if(!_this.props.propsValue.zones){
            fetch('/zones',{credentials: 'include'}).then(function(response) {
              return response.json();
            }).then(function(result) {
                _this.setState({
                    zones: result.zones,
                    isloading: false
                });
                const {dispatch} = _this.props;
                dispatch(setZones(result.zones));
            }).catch(function(e) {
                _this.setState({
                    msg: '加载失败!'
                })
            });
        }else{
                _this.setState({
                    zones: _this.props.propsValue.zones,
                    isloading: false
            });
        }
    }
  render(){
        var model = this.props.propsValue.model;
        var user = this.props.propsValue.user;
        var url = this.props.propsValue.list_urls[model];
        var options = {
            zone: this.state.zones
        };
        var search_list = (
            <Search_panel model={model} options={options} url={url}/>
        );
        var list = function(model){
            let thead = [];
            switch(model){
                case 'components':
                    thead = [{
                        txt: '识别码',
                        name: 'sno',
                        type: 'txt'
                    },{
                        txt: '品牌',
                        name: 'brand',
                        type: 'txt'
                    },{
                        txt: '配件',
                        name: 'name',
                        type: 'href'
                    },
                    {
                        txt: '类别',
                        name: 'type',
                        type: 'txt'
                    },
                    {
                        txt: '归属',
                        name: 'zone',
                        type: 'txt'
                    },
                    {
                        txt: '数量',
                        name: 'count',
                        type: 'txt'
                    },{
                        txt: '用途',
                        name: 'use_for',
                        type: 'txt'
                    },{
                        txt: '状态',
                        name: 'status',
                        type: 'txt'
                    }];
                    return (
                            <Table model={model} thead={thead} user_id={user.user_id} isAdmin={user.isAdmin} superAdmin={user.superAdmin}/>
                        );
                case 'orders':
                    thead = [{
                        txt: '品牌',
                        name: 'brand',
                        type: 'txt'
                    },{
                        txt: '配件',
                        name: 'name',
                        type: 'href'
                    },
                    {
                        txt: '用户',
                        name: 'user',
                        type: 'txt'
                    },{
                        txt: '数量',
                        name: 'count',
                        type: 'txt'
                    },{
                        txt: '周期',
                        name: 'range',
                        type: 'txt'
                    },{
                        txt: '费用',
                        name: 'bill',
                        type: 'txt'
                    },{
                        txt: '类型',
                        name: 'status',
                        type: 'txt'
                    },{
                        txt: '状态',
                        name: 'order_state',
                        type: 'txt'
                    },{
                        txt: '操作',
                        type: 'action',
                        actions:[
                            {
                                action: 'return_component',
                                label: '归还',
                                conflict: {
                                    key: 'order_state',
                                    val: '已完成'
                                },
                                permission: 'admin'
                            }
                        ]
                    }];
                    return (
                            <Table model={model} thead={thead} user_id={user.user_id} isAdmin={user.isAdmin} superAdmin={user.superAdmin}/>
                        );
                case 'users':
                    thead = [{
                        txt: '用户',
                        name: 'username',
                        type: 'txt'
                    },
                    {
                        txt: '归属',
                        name: 'zone',
                        type: 'txt'
                    },{
                        txt: '身份',
                        name: 'permission',
                        type: 'txt'
                    },{
                        txt: '操作',
                        type: 'action',
                        actions:[
                            {
                                action: 'update_user',
                                label: '更改权限',
                                conflict: {
                                    key: 'permission',
                                    val: 'super_admin'
                                },
                                permission: 'superAdmin'
                            }
                        ]
                    }];
                    return (
                            <Table model={model} thead={thead} user_id={user.user_id} isAdmin={user.isAdmin} superAdmin={user.superAdmin}/>
                        );
                default:
                    return(
                            <div></div>
                        )
            }
        }(model);
          return (
              user.isAdmin == undefined?<div></div>:<Provider store={tplStore}>
                <div className="search-panel">
                    {search_list}
                    {list}
                </div>
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

export default connect(mapStateToProps)(List);