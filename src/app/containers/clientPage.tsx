import * as React from 'react';

class ClientPageComponent extends React.Component<any, any> {
	render() {
		return (
			<div>
				This is client page
				{this.props.children}
			</div>
		);
	}
};

export const ClientPage = ClientPageComponent;
