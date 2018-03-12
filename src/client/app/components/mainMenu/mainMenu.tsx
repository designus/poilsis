import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { clientRoutes } from '../../client-utils';

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

export const MainMenu = (props) => {
  const {citiesMap, typesMap, selectedCityId, showSubmenu} = props;

  return (
    <div className="menu">
      <ul>
        {citiesMap ? Object.keys(citiesMap).map((cityId) => {
          const city = citiesMap[cityId];
          const types = city.types;
          const isSubmenuVisible = showSubmenu && typesMap && types.length > 0 && selectedCityId === cityId;
          return (
            <li key={cityId}>
              <NavLink
                activeStyle={{ color: 'red' }}
                to={`${clientRoutes.items.getLink(city.alias)}`}
              >
                {city.name}
              </NavLink>
              {isSubmenuVisible ? getSubmenu(city.alias, types, typesMap) : ''}
            </li>
          );
        }) : ''}
      </ul>
    </div>
  );
};
