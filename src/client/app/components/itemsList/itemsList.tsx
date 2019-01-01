'use strict';
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { ITypesMap, IItem, IAppState, ICity } from 'reducers';
import { clientRoutes } from 'client-utils';
import { getLocale, getTypesMap } from 'selectors';

import { ItemTypesList } from '../itemTypesList';

interface IItemsListProps {
  locale: string;
  items: IItem[];
  typesMap: ITypesMap;
  selectedCity: ICity;
}

export class ItemsList extends React.Component<IItemsListProps> {

  renderItem = (item: IItem) => {
    return item.isEnabled && (
      <NavLink
        key={item.id}
        activeStyle={{ color: 'red' }}
        to={{
          pathname: clientRoutes.item.getLink(this.props.locale, this.props.selectedCity.alias, item.alias),
          state: {
            itemId: item.id,
          },
        }}
      >
        {item.name}<br />
        <ItemTypesList typeIds={item.types} typesMap={this.props.typesMap} />
        <hr />
      </NavLink>
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

const mapStateToProps = (state: IAppState) => ({
  locale: getLocale(state),
  typesMap: getTypesMap(state),
});

export default connect(mapStateToProps)(ItemsList);
