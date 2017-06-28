import React from 'react';
import { Link, IndexLink } from 'react-router';

export default class CitiesMenu extends React.Component {

    render() {
        const {citiesMap, selectCity} = this.props;
        return (
            <div className="menu">
                <ul>
                    {citiesMap ? Object.keys(citiesMap).map(cityId => {
                        return (
                            <li key={cityId}>
                                <Link 
                                    activeStyle={{ color: 'red' }}
                                    // onClick={() => selectCity(cityId)}
                                    to={citiesMap[cityId].alias}
                                >
                                    {citiesMap[cityId].name}
                                </Link>
                            </li>
                        )
                    }): ''}
                </ul>
            </div>
        )
    }
}