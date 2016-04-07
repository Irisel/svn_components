import React from 'react';
import { connect } from 'react-redux';
import {setZones} from '../../actions/home'
import Form from '../../components/form'
import fetch from 'isomorphic-fetch';


class Components_add extends React.Component{
    constructor(props) {
        super(props);
        this.state = {inputs: [
                {
                    name: 'sno',
                    placeholder: '',
                    label: '配件识别码',
                    val: '',
                    invalid: false,
                    invalid_msg: '',
                    focus: false,
                    type: 'text',
                    required: true
                },{
                    name: 'name',
                    placeholder: '',
                    label: '配件名称',
                    val: '',
                    invalid: false,
                    invalid_msg: '',
                    focus: false,
                    type: 'text',
                    required: true
                },
                {
                    name: 'brand',
                    placeholder: '',
                    label: '配件品牌',
                    val: '',
                    invalid: false,
                    invalid_msg: '',
                    focus: false,
                    type: 'text',
                    required: true
                },
                {
                    name: 'type',
                    placeholder: '',
                    label: '配件类型',
                    val: 'normal',
                    required: true,
                    invalid: false,
                    invalid_msg: '',
                    options: [{
                        name: '普通',
                        val: 'normal'
                    },
                        {
                            name: '消耗品',
                            val: 'consumable'
                        }
                    ],
                    type: 'select',
                    conflict: {
                        val: 'consumable',
                        row: [0]
                    },
                    setDisable: {
                        val: 'normal',
                        row: [8]
                    }
                },
                {
                    name: 'zone',
                    placeholder: '',
                    label: '配件归属',
                    val: '',
                    invalid: false,
                    invalid_msg: '',
                    focus: false,
                    options: [],
                    type: 'select',
                    required: true
                },
                {
                    name: 'use_for',
                    placeholder: '',
                    label: '配件用途',
                    type: 'radio',
                    val: 'provide',
                    radios: [
                        {
                            checked: true,
                            val: 'provide',
                            text: '借用'
                        },
                        {
                            checked: false,
                            val: 'rent',
                            text: '领用'
                        },
                        {
                            checked: false,
                            val: 'provide_and_rent',
                            text: '不限'
                        }
                    ],
                    required: true
                },{
                    name: 'cost',
                    placeholder: '',
                    label: '配件成本',
                    val: '',
                    invalid: false,
                    invalid_msg: '',
                    focus: false,
                    type: 'text'
                },{
                    name: 'price',
                    placeholder: '',
                    label: '配件价格',
                    val: '',
                    invalid: false,
                    invalid_msg: '',
                    focus: false,
                    type: 'text'
                },
                {
                    name: 'count',
                    placeholder: '',
                    label: '配件数量',
                    val:1,
                    disabled: true,
                    default: 1,
                    invalid: false,
                    invalid_msg: '',
                    focus: false,
                    type: 'number',
                    required: true
                },{
                    name: 'description',
                    placeholder: '',
                    label: '配件描述',
                    val: '',
                    invalid: false,
                    invalid_msg: '',
                    focus: false,
                    type: 'textarea'
                }
            ],
            isloading: true,
            msg: '加载中...'}
    }
    componentDidMount(){
        var _this = this;
        if(!_this.props.propsValue.zones){
            fetch('/zones',{credentials: 'include'}).then(function(response) {
              return response.json();
            }).then(function(result) {
                var inputs = _this.state.inputs;
                inputs[4].options = result.zones;
                inputs[4].val = inputs[4].options[0].val;
                _this.setState({
                    inputs: inputs,
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
            var inputs = _this.state.inputs;
                inputs[4].options = _this.props.propsValue.zones;
                inputs[4].val = inputs[4].options[0].val;
                _this.setState({
                    inputs: inputs,
                    isloading: false
            });
        }
    }
  render(){

          var inputs = this.state.inputs;
          var isloading = this.state.isloading;
          var user = this.props.propsValue.user;
          var msg = this.state.msg;
          var addition = [{
              key: 'operator_id',
              val:user.user_id
          }];
          return (
              user.isAdmin == undefined?<div></div>:(isloading?<div className="msg-box"><p>{ msg }</p></div>:<div className="shortcut_box">
                    <Form inputs = {inputs} method="post" action="/admin/create_component" addition={addition}/>
              </div>)
              )
      }
  }

function mapStateToProps(state) {
  return {
    propsValue: state
  }
}

export default connect(mapStateToProps)(Components_add);