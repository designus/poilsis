import * as React from 'react';

class AdminPageComponent extends React.Component<any, any> {
	render() {
		return (
			<div>
				This is admin page
				{this.props.children}
			</div>
		);
	}
};

export const AdminPage = AdminPageComponent;
