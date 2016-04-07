import React from 'react';
import cx from 'classnames';
import { Calendar, DateRange } from 'react-date-range';
import fetch from 'isomorphic-fetch';

const Form = React.createClass({
    getInitialState: function(){
        return {
            inputs: this.props.inputs || [],
            disabled: false,
            submit: {
                invalid: this.props.invalid!=undefined?this.props.invalid:true
            }
        }
    },
    submit: function(){
        var form = {};
        this.state.inputs.map(function(item){
            if(!item.hidden)form[item.name] = item.val;
        });
        if(this.props.addition){
            this.props.addition.map(function(addi){
                form[addi.key] = addi.val;
            });
        }
        this.setState({
            disabled: true
        });
        var _this = this;
        fetch(_this.props.action,{credentials: 'include',
                method: _this.props.method,
	            body: JSON.stringify({
		            form: form
	            })
        }).then(function(response) {
          return response.json();
        }).then(function(result) {
           result.redirect_to?location.href = result.redirect_to:_this.clear();
           result.success && _this.props.refresh && _this.props.refresh();
        }).catch(function(e) {
            _this.setState({
                disabled: false
            });
        });
    },
    test: function(item, value){
        if(item.pattern && value){
            return !item.pattern.test(value);
        }else if((item.required && !item.hidden) && !value){
            return true
        }
        return false
    },
    changeHandle: function(index, item){
        var[_item, _index, _this] = [item,index,this];
        return function(event){
            var inputs = _this.state.inputs,
                value = event.target.value,
                submit_invalid = false;
            inputs[_index].val = value;
            inputs[_index].invalid = _this.test(_item, value);
            inputs.map(function(i, j){
                submit_invalid = i.invalid || submit_invalid || (i.required && !i.val && !i.hidden);
            });
            _this.setState({
                inputs: inputs,
                submit: {
                    invalid: submit_invalid
                }
            })
        }
    },
    changeRadio: function(index, j){
        var [_index, _this, _j] = [index,this, j];
        return function(event){
            var inputs = _this.state.inputs;
            inputs[_index].val = event.target.value;
            inputs[_index].radios.map(function(item){
               item.checked = false;
            });
            inputs[_index].radios[_j].checked = true;
            _this.setState({
                inputs: inputs
            })
        }
    },
    focus: function(item, is_focus){
        var [_this, _item, _is_focus] = [this, item, is_focus];
        return function(event){
            _item.focus = _is_focus;
            var inputs = _this.state.inputs;
            _this.setState({
                inputs: inputs,
                disabled: false
            })
        }
    },
    clear: function(){
        var inputs = this.state.inputs;
        inputs.map(function(item, index){
            if(item.type=='text' || item.type=='number' || item.type=='textarea')item.val = item.default || '';
            if(item.type=='select')item.val = item.options[0].val;
            if(item.type=='radio')item.val = item.radios[0].val;
            item.invalid = false;
        });
        this.setState({
            inputs: inputs,
            submit: {
                invalid: true
            },
            disabled: false
        })
    },
    dateSelect: function(index){
        var _this = this;
        return function(e){
            var date = e._d;
            var day = date.getDate(),
                 month = date.getMonth() + 1,
                 year = date.getFullYear(),
                 inputs = _this.state.inputs;
            inputs[index].val = [year, month, day].join('-');
            _this.setState({
                inputs: inputs
            })
        }
    },
    changeSelect: function(item, index){
        var [_this, _item, _index] = [this, item,index];
        return function(event){
            var inputs = _this.state.inputs;
            inputs[_index].val = event.target.value;
            if(_item.conflict){
                _item.conflict.row.map(function(index){
                    inputs[index].hidden = event.target.value == _item.conflict.val;
                });
            }
            var submit_invalid = false;
            inputs.map(function(input){
                input.invalid = _this.test(input, input.val);
                submit_invalid = submit_invalid || input.invalid || (input.required && !input.val && input.hidden);
            });
            _this.setState({
                inputs: inputs,
                submit: {
                    invalid: submit_invalid
                }
            });
            if(_item.setDisable){
                _item.setDisable.row.map(function(index){
                    inputs[index].disabled = event.target.value == _item.setDisable.val;
                });
            }
        }
    },
    rangeSelect: function(index){
        var _this = this;
        return function(e){
            var startDate = e.startDate._d,
                 endDate = e.endDate._d,
                 inputs = _this.state.inputs;
            startDate = [startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate()].join('-');
            endDate = [endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate()].join('-');
            inputs[index].val = [startDate, endDate];
            _this.setState({
                inputs: inputs
            })
        }
    },
    render: function(){
        var changeHandle = this.changeHandle,
             changeRadio = this.changeRadio,
             dateSelect = this.dateSelect,
             rangeSelect = this.rangeSelect,
             changeSelect = this.changeSelect,
             disabled= this.state.disabled,
             focus = this.focus,
             _this = this,
             form_data = {},
             buttons = this.props.buttons,
             inputs = this.state.inputs.map(function(item, index){
            var input_classes = cx({
                'input-box': true,
                'invalid': item.invalid
            });
            var invalid_classes= cx({
                'invalid-label': true,
                'invalid': item.invalid && !item.focus
            });
            form_data[item.name] = item.invalid?'':item.val;
            if(!item.hidden)switch(item.type){
                case 'text':
                    return (
                        <div key={index}>
                            <label>{item.label}{item.required?'*':''}</label>
                            <div className= {input_classes}>
                                <input type={item.type} disabled= {disabled || item.disabled} name={ item.name } value={item.val} ref={item.name} onFocus={focus(item, true)} onBlur={focus(item, false)} placeholder={item.placeholder} onChange={changeHandle(index, item)}/>
                                <label className={invalid_classes}>{item.invalid_msg}</label>
                            </div>
                        </div>
                    );
                case 'number':
                    return (
                        <div key={index} >
                            <label>{item.label}{item.required?'*':''}</label>
                            <div className= {input_classes}>
                                <input type={item.type}  disabled= {disabled || item.disabled} name={ item.name } value={item.val} ref={item.name} onFocus={focus(item, true)} onBlur={focus(item, false)} placeholder={item.placeholder} onChange={changeHandle(index, item)}/>
                                <label className={invalid_classes}>{item.invalid_msg}</label>
                            </div>
                        </div>
                    );
                case 'datepicker':
                    return (
                        <div key={index} >
                            <label>{item.label}{item.required?'*':''}</label>
                            <div className= {input_classes}>
                                <Calendar  disabled= {disabled || item.disabled}  onInit={dateSelect(index)} onChange={dateSelect(index)}/>
                            </div>
                        </div>
                    );
                case 'rangepicker':
                    return (
                        <div key={index} >
                            <label>{item.label}{item.required?'*':''}</label>
                            <div className= "rangepicker-box">
                                <DateRange  disabled= {disabled || item.disabled} onInit={rangeSelect(index)} onChange={rangeSelect(index)}/>
                            </div>
                        </div>
                    );
                case 'radio':
                    var radios = item.radios.map(function(i, j){
                        return (
                                <div key={j}>
                                    <input type='radio'  disabled= {disabled || item.disabled} name={ item.name } checked={i.checked} value={i.val} onChange={changeRadio(index, j)} ref={item.name}/>
                                    <span>{i.text}</span>
                                </div>
                            )
                    });
                    return (
                        <div key={index} >
                            <label>{item.label}{item.required?'*':''}</label>
                            <div className= "radio-box">
                                {radios}
                            </div>
                        </div>
                    );
                case 'select':
                    var options = item.options.map(function(i, j){
                        return (
                                <option key={j} value={i.val}>{i.name}</option>
                            )
                    });
                    return (
                        <div key={index} >
                            <label>{item.label}{item.required?'*':''}</label>
                            <div className="input-box">
                                <select  value={item.val} disabled= {disabled || item.disabled} onChange={changeSelect(item, index)}>
                                    {options}
                            </select>
                            </div>
                        </div>
                        );
                case 'textarea':
                    return (
                        <div key={index}>
                            <label>{item.label}{item.required?'*':''}</label>
                            <div className="input-box">
                                <textarea  disabled= {disabled || item.disabled} name={ item.name } value={item.val} ref={item.name} onFocus={focus(item, true)} onBlur={focus(item, false)} placeholder={item.placeholder} onChange={changeHandle(index, item)}/>
                            </div>
                        </div>
                        );
                default:
                    return (
                        <div key={index} >
                            <label></label>
                            <div className= {input_classes}>
                            </div>
                        </div>
                    );
            }

        });
        var submit_classes = cx({
                'form-btn': true,
                'btn': true,
                'invalid': this.state.submit.invalid
        });
        var form_classes = cx({
            'form_box': true,
            'loading': this.state.disabled
        });
        var _buttons = (
                buttons?function(buttons){
                    var _buttons = buttons.map(function(button, key){
                        switch(button){
                            case 'submit':
                                return <button key={key} className= {submit_classes} disabled={_this.state.submit.invalid ||  disabled } onClick={_this.submit} type="button"><span>提交</span></button>;
                            case 'clear':
                                return <button key={key} className= "form-btn btn" disabled={disabled} type="button" onClick={_this.clear}><span>清空</span></button>;
                            default:
                                return ''
                        }
                    });
                    return (
                            <div className="common-btn-box">
                                {_buttons}
                            </div>
                        )
                }(buttons):<div className="common-btn-box">
                    <button className= {submit_classes} disabled={this.state.submit.invalid ||  disabled } onClick={this.submit} type="button"><span>提交</span></button>
                    <button className= "form-btn btn" disabled={disabled} type="button" onClick={this.clear}><span>清空</span></button>
                </div>
            );
        this.props.update && this.props.update(form_data);
        return (
                <div className={form_classes}>
                    <div className="board"></div>
                    <form className="common-form">
                        <div className="form-box">
                            { inputs }
                        </div>
                        {_buttons}
                    </form>
                </div>
            )
    }
});

export default Form