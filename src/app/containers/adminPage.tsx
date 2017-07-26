import * as React from 'react';
import {asyncConnect } from 'redux-connect';
// import {IndexLink, Link} from 'react-router';
import {typesProps, citiesProps} from '../helpers';

@asyncConnect([typesProps, citiesProps])
class AdminPageComponent extends React.Component<any, any> {
	render() {
		console.log('This props', this.props);
		return (
			<div>
				<div>
					<ul>
						<li>Items</li>
						<li>Types</li>
					</ul>
				</div>
				<div>
					<h1>Sveiki atvyke</h1>
					{this.props.children}
				</div>
			</div>
		);
	}
};

export const AdminPage = AdminPageComponent;
