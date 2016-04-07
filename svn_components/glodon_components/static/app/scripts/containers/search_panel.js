import React from 'react';
import { connect } from 'react-redux';
import {tpl_form, filter_update, fetchList}  from '../actions/tpl';
import cx from 'classnames';

const Search_panel = React.createClass({
    getInitialState: function(){
        var model = this.props.model;
        return {
            search_log: this.props.propsTplvalue[model].search_log || '',
            wrap: false
        }
    },
  componentDidMount: function(){
        var model = this.props.model;
        var params = model?this.props.propsTplvalue[model].params: {};
        var url = this.props.url;
        const {dispatch} = this.props;
        dispatch(fetchList(url, model, params));
  },
  search: function(param, value){
      var _param = param;
      var _value = value;
      var _this = this;
      return function(){
        var model = _this.props.model;
        _this.props.dispatch(filter_update(model, {
            key: _param,
            value: _value
        }));
      }
  },
  change: function(item){
      var _this = this;
      return function(e){
        var model = _this.props.model;
        _this.props.dispatch(filter_update(model, {
            key: item.name,
            value: e.target.value
        }));
      }
  },
  submit: function(e){
        e.target.blur();
        var model = this.props.model;
        var params = model?this.props.propsTplvalue[model].params: {};
        var search_inputs = model?this.props.propsTplvalue[model].search_inputs:[];
        var props_options = this.props.options;
        var search_log = [];
        if(params.name)search_log.push(params.name);
        search_inputs.map(function(tr){
            tr.tds.map(function(td){
                if(params.hasOwnProperty(td.name)){
                    switch(td.type){
                        case 'select':
                            (td.options || props_options[td.name] || []).map(function(option){
                                if(params[td.name] && option.val == params[td.name])search_log.push(option.name);
                            });
                            break;
                        case 'radio':
                            td.radios.map(function(radio){
                                if(params[td.name] && radio.val == params[td.name])search_log.push(radio.text);
                            });
                            break;
                        default:
                            break;
                    }
                }
            });
        });
        var url = this.props.url;
        const {dispatch} = this.props;
        dispatch(fetchList(url, model, params));
        this.setState({
            search_log: search_log.join('、')
        })
  },
  wrap: function(){
        let wrap = this.state.wrap;
        this.setState({
            wrap: !wrap
        })
  },
  render: function(){
      var model = this.props.model;
      var search_links = model?this.props.propsTplvalue[model].search_links:[];
      var search_inputs = (model && !this.state.wrap)?this.props.propsTplvalue[model].search_inputs:[];
      var params = model?this.props.propsTplvalue[model].params: {};
      var props_options = this.props.options;
      var search = this.search;
      var change = this.change;
      var lis = search_links.map(function(item, key){
            var classes= cx({
                'active': params[item.param]
            });
            return (
                    <li key={key} onClick={search(item.param ,true)} ref={item.param} className={classes}>
                        <a>{item.name}</a>
                    </li>
                )
      });
      var inputs = search_inputs.map(function(item, key){
          var tr = item.tds.map(function(i, j){
            switch(i.type){
              case 'text':
                    return (
                        <div key={j} className="query_td">
                            <label>{i.label}</label>
                            <input value={params[i.name]} onChange={change(i)}/>
                        </div>
                    );
              case 'select':
                    var select_options = props_options && !i.options?props_options[i.name]: i.options;
                    var options = select_options.map(function(m, n){
                       return (
                            <option key={n} value={m.val}>{m.name}</option>
                           )
                    });
                    return (
                        <div key={j} className="query_td">
                            <label>{i.label}</label>
                            <select value={params[i.name]} onChange={change(i)}>
                                <option value="">不限</option>
                                { options }
                            </select>
                        </div>
                    );
                case 'radio':
                    var radios = i.radios.map(function(m, n){
                        return (
                                <div key={n}>
                                    <input type='radio' checked={m.val == params[m.name]} value={m.val} onChange={change(m)}/>
                                    <span>{m.text}</span>
                                </div>
                            )
                    });
                    return (
                        <div key={j} className="query_td">
                            <label>{i.label}</label>
                            <div className= "radio-box">
                                {radios}
                            </div>
                        </div>
                    );
              default:
                    return (
                        <div key={j} className="query_td">
                        </div>
                    );
            }
          });
          return (
                <div key={key} className="query_row">
                    { tr }
                </div>
              )
      });
      var name = {
          name: 'name'
      };
      return (
        <div>
            <div className="query_type">
                <ul className="clearfix">
                    {lis}
                </ul>
            </div>
            <div className="query_search">
                <div className="query_form clearfix">
                    <input type="text" value={params.name} onChange={change(name)}/>
                    <button type="button" onClick={this.submit}><span className="glyphicon glyphicon-search"/>搜索</button>
                    <a onClick={this.wrap}>精简搜索条件</a>
                </div>
            </div>
            <div className="query_table">
                <div className="query_row_group">
                    { inputs }
                </div>
            </div>
            <div className="clearfix paginator">
                <div className="left">
                    搜索条件: {this.state.search_log}
                </div>
                <div className="right">
                    <label>每页</label>
                    <input/>
                    <a>
                        <span className="glyphicon glyphicon-chevron-left"></span>
                    </a>
                    <a>
                        <span className="glyphicon glyphicon-chevron-right"></span>
                    </a>
                </div>
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

export default connect(mapStateToProps)(Search_panel);