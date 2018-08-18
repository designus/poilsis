'use strict';
import * as React from 'react';
import { ItemTypesList } from '../itemTypesList';
import { IItemsMap, ITypesMap } from 'reducers';

export interface IItemsListProps {
  items: string[];
  itemsMap: IItemsMap;
  typesMap: ITypesMap;
}

export class ItemsList extends React.Component<IItemsListProps, {}> {

  renderItem = itemId => {
    const item = this.props.itemsMap[itemId];
    return item.isEnabled && (
      <div className="item" key={itemId}>
        {item.name}<br />
        <ItemTypesList typeIds={item.types} typesMap={this.props.typesMap} />
        <hr />
      </div>
    );
  }

  render() {

    const items = this.props.items || [];

    return (
      <div className="itemsList">
        {items.map(this.renderItem)}
      </div>
    );
  }
}
