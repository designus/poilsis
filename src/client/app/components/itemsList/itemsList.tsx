'use strict';
import * as React from 'react';
import { ItemTypesList } from '../itemTypesList';
import { ITypesMap, IItem } from 'reducers';

export interface IItemsListProps {
  items: IItem[];
  typesMap: ITypesMap;
}

export class ItemsList extends React.Component<IItemsListProps, {}> {

  renderItem = (item: IItem) => {
    return item.isEnabled && (
      <div className="item" key={item.id}>
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
