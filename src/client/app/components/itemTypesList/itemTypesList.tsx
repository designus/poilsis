import * as React from 'react';
import { ITypesMap } from '../../reducers';
import { IGenericDataMap } from '../../client-utils';

export interface IItemsTypesList {
  typeIds: string[];
  typesMap: IGenericDataMap<ITypesMap>;
}

export const ItemTypesList = ({typeIds, typesMap}: IItemsTypesList) => {

  return (
    <div>
      {
        typeIds.map((typeId) => {
          const type = typesMap[typeId];
          if (type) {
            return (
              <span key={typeId} className="types" style={{ fontSize: 12 + 'px' }}>
                {typesMap[typeId].name}&nbsp;
              </span>
            );
          }
          return null;
        })
      }
    </div>
  );
};
