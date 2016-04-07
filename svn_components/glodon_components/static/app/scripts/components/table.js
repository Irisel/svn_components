import React from 'react';
import { connect } from 'react-redux';
import {tpl_form, appendContain} from '../actions/tpl';
import {provide_inputs, rent_inputs, return_inputs, update_user_inputs} from '../const/shortcut_forms'
import cx from 'classnames';

const Table = React.createClass({
    getInitialState: function(){
        return {
            items: []
        }
    },
    return_compoment: function(parent){
        var inputs = return_inputs();
        var params = {};
        var model = this.props.model,
            list = this.props.propsTplvalue[model].list,
            index = parent.getAttribute('data-index'),
            detail = list[parseInt(index)];
        const {dispatch} = this.props;
          dispatch(tpl_form({
              show: true
          }));
        var addition = [{
          key: 'operator_id',
          val:this.props.user_id
        },
        {
          key: detail.type=='consumable'?'id':'sno',
          val: detail.type=='consumable'?detail.accessory_id:detail.sno
        },
        {
          key: 'order_id',
          val: detail.id
        }];
        if(detail.type=='normal'){
            inputs[2].disabled = true;
            inputs[2].default = 1;
            inputs[2].val = 1;
        }
        dispatch(appendContain({type: 'form', refresh: '/project/orders_list', params:params, inputs: inputs, belong: model, action: '/admin/return_component', addition: addition, name: '归还配件'}));
    },
    update_user: function(parent){
        var inputs = update_user_inputs();
        var params = {};
        var model = this.props.model,
            list = this.props.propsTplvalue[model].list,
            index = parent.getAttribute('data-index'),
            detail = list[parseInt(index)];
        const {dispatch} = this.props;
          dispatch(tpl_form({
              show: true
          }));
        var addition = [{
          key: 'operator_id',
          val:this.props.user_id
        },
        {
          key: 'user_name',
          val: detail.username
        }];
        inputs[0].val = inputs[0].default = detail.orig_permission;
        dispatch(appendContain({type: 'form', buttons: ['submit'], refresh: '/project/users_list', params:params, inputs: inputs, invalid: false, belong: model, action: '/admin/update_user', addition: addition, name: '更改权限'}));
    },
    delegateClick: function(e){
        var event = e || window.event,
        target = event.target || event.srcElement;
        if(target.tagName.toLowerCase() == 'button'){
            var action = target.getAttribute('data-action');
            switch(action){
                case 'return_component':
                    this.return_compoment(target.parentElement);
                    break;
                 case 'update_user':
                    this.update_user(target.parentElement);
                    break;
                default:
                    break;
            }
        }
    },
    render: function(){
        var model = this.props.model;
        var isAdmin = this.props.isAdmin;
        var superAdmin = this.props.superAdmin;
        var list = (model?this.props.propsTplvalue[model].list: this.state.items) || [];
        var loading = this.props.propsTplvalue[model].isloading;
        var table_classes= cx({
            'table-common': true,
            'isloading': this.props.propsTplvalue[model].isloading
        });
        var thead = this.props.thead;
        var ths = thead.map(function(th, key){
            return (
                    <th key={key}>{th.txt}</th>
                )
        });
        var trs = list.map(function(item, key1){
            var tds = thead.map(function(th, key2){
                switch(th.type){
                    case 'txt':
                        return (
                                <td key={key2}>{th.name?item[th.name]:''}</td>
                            );
                    case 'action':
                        var buttonlist = th.actions.map(function(button, key3){
                           let has_permission = true;
                           if(button.permission == 'admin'){
                               has_permission = isAdmin
                           }else if(button.permission == 'superAdmin'){
                               has_permission = superAdmin
                           }
                           return  (
                               ((!button.conflict || item[button.conflict.key]!=button.conflict.val) && has_permission)?<button key={key3} data-action={button.action} disabled={loading}>{button.label}</button>:''
                               )
                        });
                        return (
                                <td key={key2} data-index={key1}>{buttonlist}</td>
                            );
                    case 'href':
                        return (
                                <td key={key2} data-index={key1}><a href={item.href}>{th.name?item[th.name]:''}</a></td>
                            );
                    default:
                        return (
                                <td key={key2}></td>
                            )
                }
            });
            return (
                    <tr key={key1}>{tds}</tr>
                )
        });
        return (
                <div className="table-box">
                    <table className={table_classes} onClick={this.delegateClick}>
                        <thead>
                            <tr>{ths}</tr>
                        </thead>
                        <tbody>
                            {trs}
                        </tbody>
                    </table>
                </div>
            )
    }
});

function mapStateToProps(state) {
  return {
    propsTplvalue: state
  }
}

export default connect(mapStateToProps)(Table);