import React from 'react';
import { connect } from 'react-redux';
import * as action from '../../actions/home'
import Form from '../../components/form'

class Home_return extends React.Component{
  render(){
          var user = this.props.propsValue.user;
          var inputs = [
                {
                    name: 'sno',
                    placeholder: '',
                    label: '配件识别码',
                    val: '',
                    invalid: false,
                    invalid_msg: '',
                    focus: false,
                    type: 'text'
                },
                {
                    name: 'username',
                    placeholder: '',
                    label: '员工域账号',
                    val: '',
                    invalid: false,
                    invalid_msg: '',
                    focus: false,
                    type: 'text'
                },
//                {
//                    name: 'finished_at',
//                    placeholder: '',
//                    label: '归还日期',
//                    val: '',
//                    invalid: false,
//                    invalid_msg: '',
//                    type: 'datepicker'
//                },
                {
                    name: 'is_broken',
                    label: '配件质量',
                    type: 'radio',
                    val: false,
                    radios: [
                        {
                            checked: true,
                            val: false,
                            text: '正常'
                        },
                        {
                            checked: false,
                            val: true,
                            text: '损坏'
                        }
                    ]
                },
                {
                    name: 'count',
                    placeholder: '',
                    label: '归还个数',
                    required: true,
                    val: '1',
                    default: '1',
                    invalid: false,
                    disabled: true,
                    invalid_msg: '',
                    focus: false,
                    type: 'number'
                }
            ];
          var addition = [{
              key: 'operator_id',
              val:user.user_id
          }];
          return (
              user.isAdmin == undefined?<div></div>:<div><div className="shortcut_box">
                    <Form inputs = {inputs} method="post" action="/admin/return_component" addition={addition}/>
              </div>
              </div>
              )
      }
  }

function mapStateToProps(state) {
  return {
    propsValue: state
  }
}

export default connect(mapStateToProps, action)(Home_return);