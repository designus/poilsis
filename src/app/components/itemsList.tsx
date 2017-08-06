'use strict';
import * as React from 'react';
import {ItemTypesList} from './itemTypesList';

export default class ItemsList extends React.Component<any, any> {

	render() {

		return (
			<div className="itemsList">
				{this.props.items.map(itemId => {
						const item = this.props.itemsMap[itemId];
						return (
							<div className="item" key={itemId}>
								{item.name}<br />
								<ItemTypesList typeIds={item.types} typesMap={this.props.typesMap} />
								<hr />
							</div>
						);
				})}
			</div>
		);
	}
}
