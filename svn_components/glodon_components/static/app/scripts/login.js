import React from 'react';
import ReactDom from 'react-dom';
import cx from 'classnames'
import fetch from 'isomorphic-fetch';

const Login = React.createClass({
    getInitialState: function(){
        return {
            inputs: [
                {
                    name: 'username',
                    placeholder: '请输入员工域账号',
                    val: '',
                    pattern: /^[a-zA-Z]+([\-\.]?[a-zA-Z0-9]+)*$/,
                    invalid: false,
                    invalid_msg: '域账号格式错误',
                    focus: false,
                    type: 'text'
                },
                {
                    name: 'passwd',
                    placeholder: '请输入密码',
                    val: '',
                    pattern: /^[a-zA-Z0-9\d#@$!~%^&*\.\-_]{6,18}$/,
                    invalid: false,
                    invalid_msg: '密码格式错误',
                    focus: false,
                    type: 'password'
                }
            ],
            submit: {
                invalid: true
            },
            msg: '登陆'
        }
    },
    login: function(form){
        var _this = this;
        fetch('/signin', {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                credentials: 'include',
	            method: 'post',
	            body: JSON.stringify({
		        form: form
	        })
        }).then(function(response) {
          return response.json();
        }).then(function(data) {
          if(data.success===true){
                _this.setState({
                    msg: '登陆成功!'
                });
              if(data.redirect){
                  location.href= data.redirect
              }else{
                  location.href='/app/home'
              }
          }else{
                _this.setState({
                    submit: {
                        invalid: false
                    },
                    msg: data.msg
                });
          }
        }).catch(function(e) {
            _this.setState({
                submit: {
                    invalid: false
                },
                msg: "Oops, error"
            });
        });
    },
    submit: function(){
        var form = {};
        this.state.inputs.map(function(item, index){
            form[item.name] = item.val;
        });
        this.login(form);
        this.setState({
            submit: {
                invalid: true
            },
            msg: '登陆中...'
        });
    },
    changeHandle: function(index, item){
        var _item = item,
            _index = index,
            _this = this;
        return function(event){
            var input = _this.state.inputs,
                value = event.target.value,
                submit_invalid = false;
            input[_index].val = value;
            if(_item.pattern && value){
                input[_index].invalid = !_item.pattern.test(value);
            }else{
                input[_index].invalid = false;
            }
            input.map(function(i, j){
                submit_invalid = i.invalid || submit_invalid || !i.val
            });
            _this.setState({
                inputs: input,
                submit: {
                    invalid: submit_invalid
                }
            })
        }
    },
    focus: function(item, is_focus){
        var _this = this;
        var _item = item,_is_focus = is_focus;
        return function(event){
            _item.focus = _is_focus;
            var input = _this.state.inputs;
            _this.setState({
                inputs: input
            })
        }
    },
    render: function(){
        var changeHandle = this.changeHandle;
        var focus = this.focus;
        var inputs = this.state.inputs.map(function(item, index){
            var input_classes = cx({
                'input-box': true,
                'invalid': item.invalid
            });
            var invalid_classes= cx({
                'invalid-label': true,
                'invalid': item.invalid && !item.focus
            });
            return (
                <div className= {input_classes} key={index}>
                    <input type={item.type} name={ item.name } value={item.val} ref={item.name} onFocus={focus(item, true)} onBlur={focus(item, false)} placeholder={item.placeholder} onChange={changeHandle(index, item)}/>
                    <label className={invalid_classes}>{item.invalid_msg}</label>
                </div>
            )
        });
        var submit_classes = cx({
                'form-btn': true,
                'btn': true,
                'invalid': this.state.submit.invalid
        });
        return (
            <div className="login-div">
                <div className="login-head">
                    <img src="/static/img/glodon_logo.png"/>
                </div>
                <div className="login-Form">
                    <form className="common-form">
                        <div className="form-box">
                            { inputs }
                        </div>
                        <div className="common-btn-box">
                            <button className= {submit_classes} disabled={this.state.submit.invalid} onClick={this.submit} type="button"><span>登陆</span></button>
                        </div>
                    </form>
                </div>
            </div>
            )
    }
});

ReactDom.render(
  <Login/>,
  document.getElementById('login')
);

/*
                <div className="login-msg">
                    <h2>给您更好的配件服务体验</h2>
                </div>
                <div className="login-action">
                    <ul><li><span>{this.state.msg}</span></li></ul>
                </div>
* */