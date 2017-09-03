'use strict';
import * as React from 'react';
import {ItemTypesList} from '../itemTypesList';

export interface IItemsListProps {
	items: string[];
	itemsMap: any;
	typesMap: any;
}

export class ItemsList extends React.Component<IItemsListProps, {}> {

	render() {

		const items = this.props.items || [];

		return (
			<div className="itemsList">
				{items.map(itemId => {
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
