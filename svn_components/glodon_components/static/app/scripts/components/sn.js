import React from 'react';
import {Link} from 'react-router';

const Sn = React.createClass({
    render: function(){
        return (
                <div className="sn-container">
                    <p className="clearfix">
                        <Link  to='/app/home' activeClassName="active" className="left">个人中心</Link>
                        <a className="left" href="/logout">登出</a>
                    </p>
                </div>
            )
    }
});

export default Sn