import React from 'react';
import { connect } from 'react-redux';
import * as action from '../../actions/home'
import Form from '../../components/form'

class Home_provide extends React.Component{
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
                {
                    name: 'provide_range',
                    placeholder: '',
                    label: '领用时间',
                    val: '',
                    invalid: false,
                    invalid_msg: '',
                    type: 'datepicker'
                },
                {
                    name: 'count',
                    placeholder: '',
                    label: '领用个数',
                    required: true,
                    val: '',
                    invalid: false,
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
                    <Form inputs = {inputs} method="post" action="/admin/provide_component" addition={addition}/>
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

export default connect(mapStateToProps, action)(Home_provide);