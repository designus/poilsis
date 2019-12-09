import * as React from 'react';
import { NavLink } from 'react-router-dom';

export const getSubmenu = (cityAlias, types, typesMap) => {
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
