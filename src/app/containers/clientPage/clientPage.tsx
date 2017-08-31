import * as React from 'react';

import {connect} from 'react-redux';
import {MainMenu} from '../../components';
import {asyncConnect } from 'redux-connect';
import {IndexLink, Link} from 'react-router';
import {initialDataProps} from '../../helpers';
import {IAppState} from '../../reducers';

@asyncConnect([initialDataProps])
class ClientPageComponent extends React.Component<any, any> {

	render() {
		return (
			<div className="app-container">
				<div className="header">
					This is header
				</div>
				<div className="top-menu">
					<IndexLink to="/" activeClassName="active">Home</IndexLink>&nbsp;
					<Link to="/pasiskelbti">Pasiskelbkite</Link>&nbsp;
					<Link to="/admin">Admin</Link>
				</div>
				<div className="content">
					<MainMenu {...this.props} showSubmenu={true} />
					{React.cloneElement(this.props.children, {...this.props})}
				</div>
				<div className="footer">
					This is footer
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state: IAppState) => {
	return {
		citiesMap: state.cities.dataMap,
		typesMap: state.types.dataMap,
	};
};

export const ClientPage = connect(mapStateToProps)(ClientPageComponent);
