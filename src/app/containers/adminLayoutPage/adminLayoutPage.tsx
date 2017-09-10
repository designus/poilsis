import * as React from 'react';
import { asyncConnect } from 'redux-connect';
import { initialDataProps } from '../../helpers';
import { Toast, AdminMenu, IAdminMenuItem } from '../../components';
import { withStyles } from 'material-ui/styles';
import {styles} from './styles';

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import HomeIcon from 'material-ui-icons/Home';
import ListIcon from 'material-ui-icons/List';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';

@asyncConnect([initialDataProps])
class AdminLayoutPageComponent extends React.Component<any, any> {

	state = {
		open: false,
	};

	componentDidMount() {
		const jssStyles = document.getElementById('jss-server-side');
		if (jssStyles && jssStyles.parentNode) {
			jssStyles.parentNode.removeChild(jssStyles);
		}
	}

	get adminMenuItems(): IAdminMenuItem[] {
		return [
			{
				icon: () => (<HomeIcon />),
				link: '/admin/home',
				text: 'Home',
			},
			{
				icon: () => (<ListIcon />),
				link: '/admin/items',
				text: 'Items',
			},
			{
				icon: () => (<ArrowBackIcon />),
				link: '/',
				text: 'Go to website',
			},
		];
	}

	handleDrawerOpen = () => {
		this.setState({ open: true });
	}

	handleDrawerClose = () => {
		this.setState({ open: false });
	}

	render() {
		const classes = this.props.classes;

		return (
			<div className={classes.root}>
				<div className={classes.appFrame}>
					<AppBar className={`${classes.appBar} ${this.state.open && classes.appBarShift}`}>
						<Toolbar disableGutters={!this.state.open}>
							<IconButton
								color="contrast"
								aria-label="open drawer"
								onClick={this.handleDrawerOpen}
								className={`${classes.menuButton} ${this.state.open && classes.hide}`}
							>
								<MenuIcon />
							</IconButton>
								Mini variant drawer
						</Toolbar>
					</AppBar>
					<Drawer
						type="permanent"
						classes={{
							paper: `${classes.drawerPaper} ${!this.state.open && classes.drawerPaperClose}`,
						}}
						open={this.state.open}
					>
						<div className={classes.drawerInner}>
							<div className={classes.drawerHeader}>
								Menu
								<IconButton onClick={this.handleDrawerClose}>
									<ChevronLeftIcon />
								</IconButton>
							</div>
							<Divider />
							<AdminMenu items={this.adminMenuItems} />
						</div>
					</Drawer>
					<main className={classes.content}>
						{this.props.children}
					</main>
				</div>
				<Toast />
			</div>
		);
	}
};

export const AdminLayoutPage = withStyles(styles)(AdminLayoutPageComponent);
