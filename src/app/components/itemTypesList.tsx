import * as React from 'react';

export interface IItemsTypesList {
	typeIds: string[];
	typesMap: any;
}

export const ItemTypesList = ({typeIds, typesMap}: IItemsTypesList) => {
	return (
		<div>
			{
				typeIds.map((typeId) => {
					return (
						<span key={typeId} className="types" style={{ fontSize: 12 + 'px' }}>
							{typesMap[typeId].name}&nbsp;
						</span>
					);
				})
			}
		</div>
	);
};
