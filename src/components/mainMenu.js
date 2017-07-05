import React from 'react';
import { Link, IndexLink } from 'react-router';

export const getSubmenu = (cityAlias, types, typesMap) => {
	return (
		<ul>
			{types.map(typeId => {
				const type = typesMap[typeId];
				return (
					<li key={typeId}>
						<Link 
							activeStyle={{ color: 'red' }}
							to={`/${cityAlias}/${type.alias}`}
						>
							{type.name}
						</Link>
					</li>
				);
			})}
		</ul>
	)
}

export const MainMenu = (props) => {

	const {citiesMap, typesMap, selectedCityId, selectedTypeId, showSubmenu} = props;

	return (
		<div className="menu">
			<ul>
				{citiesMap ? Object.keys(citiesMap).map(cityId => {
					const city = citiesMap[cityId];
					const types = city.types;
					const isSubmenuVisible = showSubmenu && typesMap && types.length > 0 && selectedCityId === cityId;
					return (
						<li key={cityId}>
							<Link 
								activeStyle={{ color: 'red' }}
								to={`/${city.alias}`}
							>
								{city.name}
							</Link>
							{isSubmenuVisible ? getSubmenu(city.alias, types, typesMap) : ''}
						</li>
					)
				}): ''}
			</ul>
		</div>
	)
}
