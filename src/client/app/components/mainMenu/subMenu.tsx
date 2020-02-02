import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { ITypesMap } from 'types';

export const getSubmenu = (cityAlias: string, types: any[], typesMap: ITypesMap) => {
  return (
    <ul>
      {types.map((typeId) => {
        const type = typesMap[typeId];
        return (
          <li key={typeId}>
            <NavLink
              activeStyle={{ color: 'red' }}
              to={`/${cityAlias}/${type.alias}`}
            >
              {type.name}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
};
