import * as React from 'react';
import { Link, IndexLink } from 'react-router';
import {asyncConnect } from 'redux-connect';
import {typesProps, citiesProps} from '../../helpers';

@asyncConnect([typesProps, citiesProps])
class AdminPageComponent extends React.Component<any, any> {
	render() {

		return (
			<div>
				<div>
					<ul>
						<li>
							<IndexLink to="/admin" activeClassName="active">Home</IndexLink>
						</li>
						<li>
							<Link	activeStyle={{ color: 'red' }} to="/admin/items">
								Items
							</Link>
						</li>
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
