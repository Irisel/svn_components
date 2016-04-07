import React from 'react';
import {Link} from 'react-router';
import cx from 'classnames';

const li_link = React.createClass({
  componentDidMount: function() {

  },
  render: function() {
      var links = this.props.links || [];
      var linksList = links.map(function (link, index) {
        let glyphicon_val = {
            'glyphicon': true,
            'vertical-top': true
        };
        if(link.glyphicon)glyphicon_val[link.glyphicon] = true;
        let glyphicon = cx(glyphicon_val);
        return (
          <li key={index}><Link  to={link.hash} activeClassName="active" className="clearfix"><span className={glyphicon}></span>{link.name}</Link></li>
        );
      });
      return (
        <div className="area clearfix" id="area_href">
            <div className="logo left"></div>
            <ul  className="ul_href right">
                {linksList}
            </ul>
        </div>
      );
    }
});

module.exports = li_link;
