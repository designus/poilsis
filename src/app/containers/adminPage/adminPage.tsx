import * as React from 'react';
import { Link, IndexLink } from 'react-router';
import { asyncConnect } from 'redux-connect';
import { initialDataProps } from '../../helpers';
import { Toast } from '../../components';

@asyncConnect([initialDataProps])
class AdminPageComponent extends React.Component<any, any> {
	render() {

		return (
			<div>
				<div>
					<ul>
						<li>
							<IndexLink to="/" activeClassName="active">Home</IndexLink>
						</li>
						<li>
							<Link to="/admin" activeStyle={{ color: 'red' }} >Admin page home</Link>
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
					<h1>Welcome to admin area</h1>
					{this.props.children}
				</div>
				<Toast />
			</div>
		);
	}
};

export const AdminPage = AdminPageComponent;
