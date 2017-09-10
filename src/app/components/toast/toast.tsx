import * as React from 'react';

import { withStyles } from 'material-ui/styles';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import { connect } from 'react-redux';
import { IAppState } from '../../reducers';
import { hideToast } from '../../actions';

const green = '#00c133';
const yellow = '#fcc205';
const red = '#ff3030';

const styles = theme => ({
	close: {
		width: theme.spacing.unit * 4,
		height: theme.spacing.unit * 4,
	},
	success: {
		'& > div': {
			backgroundColor: green,
		},
	},
	warning: {
		'& > div': {
			backgroundColor: yellow,
		},
	},
	error: {
		'& > div': {
			backgroundColor: red,
		},
	},
});

const CloseButton = ({className, handleRequestClose}): React.ReactElement<any> => {
	return (
		<IconButton
			key="close"
			aria-label="Close"
			color="inherit"
			className={className}
			onClick={handleRequestClose}
		>
			<CloseIcon />
		</IconButton>
	);
};

class ToastComponent extends React.Component<any, any> {

	handleRequestClose = (event, reason) => {
		this.props.dispatch(hideToast());
	}

	render() {
		const { classes, show, message, toastType } = this.props;
		return (
			<div>
				<Snackbar
					className={classes[toastType]}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					open={show}
					autoHideDuration={4000}
					onRequestClose={this.handleRequestClose}
					message={message}
					action={
						<CloseButton
							className={classes.close}
							handleRequestClose={this.handleRequestClose}
						/>
					}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state: IAppState) => {
	const {message, toastType, show} = state.toast;
	return {
		message,
		toastType,
		show,
	};
};

const StyledToastComponent = withStyles(styles)(ToastComponent) as any;
export const Toast = connect(mapStateToProps)(StyledToastComponent);
