import * as React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

export const StyledListItem = styled(ListItem)`
 	>	a {
		display: flex;
		flex: 1;
		text-decoration: none;
	}
	
	> a.active h3 {
			color: red;
			text-decoration: none;
		}
` as any;

export interface IAdminMenuItem {
	icon?: () => React.ReactElement<any>;
	link: string;
	text: string;
}

export interface IAdminMenuProps {
	items: IAdminMenuItem[];
}

export const AdminMenu = ({items}: IAdminMenuProps) => {
	return (
		<List>
			{
				items.map((item: IAdminMenuItem, i) => {
					return (
						<StyledListItem button key={i}>
							<Link to={item.link} activeClassName="active">
								<ListItemIcon>
									{item.icon()}
								</ListItemIcon>
								<ListItemText primary={item.text} />
							</Link>
						</StyledListItem>
					);
				})
			}
		</List>
	);
};
