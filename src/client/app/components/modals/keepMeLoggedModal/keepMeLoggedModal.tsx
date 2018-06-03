import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Dialog from 'material-ui/Dialog';
import { DIALOG_LOADER_ID } from '../../../client-utils';
import { modalStyles } from '../styles';
import { DialogHeader, DialogContent, DialogFooter } from '../shared';
import { IAppState } from '../../../reducers';
import { logout, keepUserLogged } from '../../../actions';

export interface IKeepMeLoggedModalProps {
  isModalOpen?: boolean;
  timeToCloseModal?: number;
  onCloseModal?: () => void;
  keepUserLogged?: () => void;
}

class KeepMeLoggedModalComponent extends React.PureComponent<IKeepMeLoggedModalProps & { classes: any }, any> {

  state = {
    error: null,
    timeToCloseModal: 0,
  };

  timerId = null;

  setCounter(timeToCloseModal) {
    clearInterval(this.timerId);
    this.setState({timeToCloseModal});
    this.timerId = setInterval(() => {
      const timeToCloseModal = this.state.timeToCloseModal - 1;
      this.setState({timeToCloseModal});
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  componentWillReceiveProps(nextProps: IKeepMeLoggedModalProps) {
    if (nextProps.timeToCloseModal) {
      this.setCounter(nextProps.timeToCloseModal);
    }
  }

  componentDidUpdate() {
    if (this.props.isModalOpen && (!this.state.timeToCloseModal || this.state.timeToCloseModal <= 0)) {
      this.onCloseModal();
    }
  }

  onCloseModal = () => {
    clearInterval(this.timerId);
    this.props.onCloseModal();
  }

  render() {
    const {classes} = this.props;
    const {error} = this.state;

    return (
      <div>
        <Dialog
          open={this.props.isModalOpen}
          onClose={this.onCloseModal}
          disableBackdropClick={true}
          disableEscapeKeyDown={true}
          classes={{
            paper: classes.paper,
          }}
        >
          <DialogHeader
            title={'Your session is about to expire'}
            className={classes.close}
            closeModal={this.onCloseModal}
          />
          <DialogContent
            error={error}
            loaderId={DIALOG_LOADER_ID}
            showLoadingOverlay={true}
            contentClass={classes.dialogContent}
          >
            Your login session will expire in <strong>{this.state.timeToCloseModal}</strong> seconds. Do you want us to keep you logged in?
          </DialogContent>
          <DialogFooter
            classes={classes}
            closeLabel={'No'}
            submitLabel={'Yes'}
            onClose={this.onCloseModal}
            onSubmit={this.props.keepUserLogged}
          />
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    isModalOpen: state.auth.showKeepMeLoggedModal,
    timeToCloseModal: state.auth.timeToCloseModal,
  };
};
const mapDispatchToProps = (dispatch) => ({
  onCloseModal: () => dispatch(logout()),
  keepUserLogged: () => dispatch(keepUserLogged()),
});

export const KeepMeLoggedModal = connect<{}, {}, IKeepMeLoggedModalProps>(mapStateToProps, mapDispatchToProps)(
  withStyles(modalStyles)(KeepMeLoggedModalComponent),
);
