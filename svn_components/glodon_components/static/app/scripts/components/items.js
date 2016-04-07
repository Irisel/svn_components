import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

const Items = React.createClass({
    getInitialState: function(){
        return {
            items: []
        }
    },
    render: function(){
        var model = this.props.model;
        var list = model?this.props.propsTplvalue[model].list: this.state.items;
        var loading = this.props.propsTplvalue[model].isloading;
        var item_classes= cx({
            'items-list clearfix': true,
            'isloading': this.props.propsTplvalue[model].isloading
        });
        var items = list.map(function(item, key){
            var href= "component/" + item.id;
            var brand = (
                item.model?<span className="brand">{item.model}</span>:<span></span>
            );
            return (
                    <div key={key} className="item left">
                        <div className="pic-box">
                            <div className="pic">
                                <a href={loading?'#':href}>
                                    <img/>
                                </a>
                            </div>
                        </div>
                        <div className="ctx-box">
                            <div className="row clearfix">
                                <span className="right">库存{item.total_number}件</span>
                            </div>
                            <div className="row title">
                                {brand}
                                <a>
                                    <span>{item.name}</span>
                                </a>
                            </div>
                            <div className="row clearfix">
                                <span className="left">{item.zone}</span>
                                <span className="right">{item.status}</span>
                            </div>
                        </div>
                    </div>
                )
        });
        return (
                <div className={item_classes}>
                    { items }
                </div>
            )
    }
});

function mapStateToProps(state) {
  return {
    propsTplvalue: state
  }
}

export default connect(mapStateToProps)(Items);