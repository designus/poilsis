'use strict';

import React from 'react';
import { Link } from 'react-router';

export default class ItemsList extends React.Component {
    
  render() {

    return (
      <div className="itemsList">
        {this.props.selectedCity.items.map(itemId => {
            const item = this.props.itemsMap[itemId];
            return (
              <div className="item" key={itemId}>
                {item.name}<br />
                {item.types.map(typeId => {
                  return (
                    <span key={typeId} className="types" style={{ fontSize: 12 + 'px' }}>
                      {this.props.typesMap[typeId].name}&nbsp;
                    </span>
                  )
                })}
                <hr />
              </div>
            )   
        })}
      </div>
    );
  }
}
