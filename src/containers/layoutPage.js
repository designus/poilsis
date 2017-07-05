import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {MainMenu} from '../components/mainMenu';
import { ReduxAsyncConnect, asyncConnect, reducer as reduxAsyncConnect } from 'redux-connect'
import { IndexLink, Link } from 'react-router';

import {fetchCities} from '../actions/cities';
import {fetchTypes} from '../actions/types';

@asyncConnect([
	{
		key: 'types',
		promise: ({params, store}) => {
			
			const typesState = store.getState().types;

			if (!typesState) {
				return store.dispatch(fetchTypes())
			} else {
				return Promise.resolve(typesState);
			}
		}
	},
	{
		key: 'cities',
		promise: ({params, store}) => {
			
			const citiesState = store.getState().cities;

			if (!citiesState) {
				return store.dispatch(fetchCities())
			} else {
				return Promise.resolve(citiesState);
			}

		}
	}
])
class LayoutPage extends React.Component {
	
	render() {
		return (
			<div className="app-container">
				<div className="header">
					This is header
				</div>
				<div className="top-menu">
					<IndexLink to="/" activeClassName="active">Home</IndexLink>&nbsp;
					<Link to="/pasiskelbti">Pasiskelbkite</Link>
				</div>
				<div className="content">
					<MainMenu {...this.props} showSubmenu={true} />
					{React.cloneElement(this.props.children, {...this.props})}
				</div>
				<div className="footer">
					This is footer
				</div>
			</div>
		)
	}
}


const mapStateToProps = (state) => {
	return {
		citiesMap: state.cities.dataMap,
		typesMap: state.types.dataMap,
		selectedCityId: state.cities.selectedId,
		selectedTypeId: state.types.selectedId
	}
}
 
export default connect(mapStateToProps)(LayoutPage);