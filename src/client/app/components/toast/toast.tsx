import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import SuccesIcon from '@material-ui/icons/SentimentVerySatisfied';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ErrorIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import WarningIcon from '@material-ui/icons/Warning';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { IAppState, Toast, ThunkDispatch } from 'types';
import { hideToast } from 'actions/toast';

import { Props, IOwnProps, IDispatchProps, IStateProps } from './types';

import { styles } from './styles';

class ToastComponent extends React.Component<Props> {

  icon = {
    [Toast.success]: () => <FontAwesomeIcon size="2x" icon={['far', 'check-circle']} />,
    [Toast.error]: () => <FontAwesomeIcon size="2x" icon={['far', 'times-circle']} />,
    [Toast.warning]: () => <WarningIcon />
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

  renderCloseButton = () => (
    <IconButton
      key="close"
      aria-label="Close"
      color="inherit"
      onClick={this.handleRequestClose}
    >
      <CloseIcon />
    </IconButton>
  )

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
        action={this.renderCloseButton()}
      />
    ) || null;
  }
}

const mapStateToProps = (state: IAppState): IStateProps => ({
  toast: state.toast
});

const mapDispatchToProps = (dispatch: ThunkDispatch): IDispatchProps => ({
  hideToast: () => dispatch(hideToast())
});

export default withStyles(styles)(
  injectIntl(
    connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(mapStateToProps, mapDispatchToProps)(ToastComponent)
  )
);
