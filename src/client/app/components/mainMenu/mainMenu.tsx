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
  const {cities, typesMap, selectedCityId, showSubmenu, locale } = props;

  return (
    <div className="menu">
      <ul>
        {cities ? cities.map((city) => {
          const types = city.types;
          const isSubmenuVisible = showSubmenu && typesMap && types.length > 0 && selectedCityId === city.id;
          return (
            <li key={city.id}>
              <NavLink
                activeStyle={{ color: 'red' }}
                to={`${clientRoutes.items.getLink(locale, city.alias)}`}
              >
                {city.name}
              </NavLink>
              {/* {isSubmenuVisible ? getSubmenu(city.alias, types, typesMap) : ''} */}
            </li>
          );
        }) : ''}
      </ul>
    </div>
  );
};
