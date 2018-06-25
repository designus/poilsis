import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import SuccesIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import WarningIcon from '@material-ui/icons/Warning';
import { connect } from 'react-redux';
import { WithStyles } from '@material-ui/core';
import { IAppState } from '../../reducers';
import { IToastState, Toast as ToastEnum } from '../../reducers/toast';
import { hideToast } from '../../actions';
import { styles } from './styles';

interface IToastProps extends IToastState, WithStyles<typeof styles>  {
  dispatch?: any;
}

const icon = {
  [ToastEnum.success]: () => <SuccesIcon />,
  [ToastEnum.error]: () => <ErrorIcon />,
  [ToastEnum.warning]: () => <WarningIcon />,
};

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

const Message = ({ text, toastType, classes }) => {
  return (
    <div className={classes.message}>
      {icon[toastType]()}
      {text}
    </div>
  );
};

class ToastComponent extends React.Component<IToastProps, any> {

  handleRequestClose = (event, reason) => {
    // this.props.dispatch(hideToast());
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
          onClose={this.handleRequestClose}
          message={<Message classes={classes} text={message} toastType={toastType} />}
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
  const { message, toastType, show } = state.toast;
  return {
    message,
    toastType,
    show,
  };
};

const StyledToastComponent = withStyles(styles)(ToastComponent);
export const Toast = connect<any, any, {}>(mapStateToProps)(StyledToastComponent);
