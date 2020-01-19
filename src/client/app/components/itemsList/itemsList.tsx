'use strict';
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { ICity, IItem, Languages } from 'global-utils/typings';
import { IAppState } from 'types';
import { clientRoutes } from 'client-utils/routes';
import { getLocalizedText, isItemEnabled } from 'client-utils/methods';

import { getClientLocale } from 'selectors';

import { ItemTypesList } from '../itemTypesList';

interface IItemsListProps {
  locale: Languages;
  items: IItem[];
  selectedCity: ICity;
}

export class ItemsList extends React.Component<IItemsListProps> {

  renderItem = (item: IItem) => {
    return isItemEnabled(item, this.props.selectedCity, this.props.locale) && (
      <NavLink
        key={item.id}
        activeStyle={{ color: 'red' }}
        to={{
          pathname: clientRoutes.item.getLink(this.props.locale, this.props.selectedCity.alias, item.alias)
        }}
      >
        {getLocalizedText(item.name, this.props.locale)}<br />
        <ItemTypesList locale={this.props.locale} typeIds={item.types} />
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
  locale: getClientLocale(state)
});

export default connect(mapStateToProps)(ItemsList);
