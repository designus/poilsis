import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import SuccesIcon from '@material-ui/icons/SentimentVerySatisfied';
import ErrorIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import WarningIcon from '@material-ui/icons/Warning';
import { connect } from 'react-redux';
import { WithStyles } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

import { IToastState, IAppState, Toast as ToastEnum } from 'reducers';
import { hideToast } from 'actions';
import { styles } from './styles';

interface IToastProps extends IToastState, WithStyles<typeof styles>  {
  toast?: IToastState;
  hideToast?: () => void;
}

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

class ToastComponent extends React.Component<IToastProps, any> {

  icon = {
    [ToastEnum.success]: () => <SuccesIcon />,
    [ToastEnum.error]: () => <ErrorIcon />,
    [ToastEnum.warning]: () => <WarningIcon />,
  };

  handleRequestClose = () => {
    this.props.hideToast();
  }

  renderToastMessage = () => {
    const { classes, toast: { toastType, message } } = this.props;
    return (
      <div className={classes.message}>
        {this.icon[toastType]()}
        <FormattedMessage id={message} />
      </div>
    );
  }

  render() {
    const { classes, toast: { show, toastType } } = this.props;
    return (
      <Snackbar
        className={classes[toastType]}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={show}
        autoHideDuration={4000}
        onClose={this.handleRequestClose}
        message={this.renderToastMessage()}
        action={
          <CloseButton
            className={classes.close}
            handleRequestClose={this.handleRequestClose}
          />
        }
      />
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  toast: state.toast,
});

const mapDispatchToProps = dispatch => ({
  hideToast: () => dispatch(hideToast()),
});

export const Toast = withStyles(styles)(
  connect<any, any, IToastProps>(mapStateToProps, mapDispatchToProps)(ToastComponent),
);
