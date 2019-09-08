import * as React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import SuccesIcon from '@material-ui/icons/SentimentVerySatisfied';
import ErrorIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import WarningIcon from '@material-ui/icons/Warning';
import { connect } from 'react-redux';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { IAppState, IToastState, Toast as ToastEnum } from 'types';
import { hideToast } from 'actions/toast';
import { styles } from './styles';

interface IToastProps extends IToastState, WithStyles<typeof styles>, InjectedIntlProps  {
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
    [ToastEnum.warning]: () => <WarningIcon />
  };

  handleRequestClose = () => {
    this.props.hideToast();
  }

  renderToastMessage = () => {
    const { classes, intl: { formatMessage }, toast: { toastType, message, error } } = this.props;
    return (
      <div className={classes.message}>
        {this.icon[toastType]()}
        {message && formatMessage({ id: message })}
        {error && `: ${formatMessage({ id: error })}`}
      </div>
    );
  }

  render() {
    const { classes, toast: { show, toastType } } = this.props;
    return show && (
      <Snackbar
        className={classes[toastType]}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
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
    ) || null;
  }
}

const mapStateToProps = (state: IAppState) => ({
  toast: state.toast
});

const mapDispatchToProps = dispatch => ({
  hideToast: () => dispatch(hideToast())
});

export const Toast = withStyles(styles)(
  injectIntl(connect<any, any, IToastProps>(mapStateToProps, mapDispatchToProps)(ToastComponent))
);
