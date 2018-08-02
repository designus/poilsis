import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import { modalStyles } from '../styles';
import { DialogHeader, DialogContent, DialogFooter } from '../shared';
import { IAppState } from 'reducers';
import { DIALOG_LOADER_ID } from 'client-utils';
import { logout, keepUserLogged } from 'actions';

export interface IKeepMeLoggedModalProps extends WithStyles<typeof modalStyles> {
  isModalOpen?: boolean;
  timeToCloseModal?: number;
  onCloseModal?: () => void;
  keepUserLogged?: () => void;
}

class KeepMeLoggedModalComponent extends React.PureComponent<IKeepMeLoggedModalProps, any> {

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
    const { classes, isModalOpen, keepUserLogged } = this.props;
    const { error, timeToCloseModal } = this.state;

    return (
      <div>
        <Dialog
          open={isModalOpen}
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
            showLoadingOverlay={true}
            loaderId={DIALOG_LOADER_ID}
            contentClass={classes.dialogContent}
          >
            Your login session will expire in <strong>{timeToCloseModal}</strong> seconds. Do you want us to keep you logged in?
          </DialogContent>
          <DialogFooter
            classes={classes}
            closeLabel="No"
            submitLabel="Yes"
            onClose={this.onCloseModal}
            onSubmit={keepUserLogged}
          />
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  isModalOpen: state.auth.showKeepMeLoggedModal,
  timeToCloseModal: state.auth.timeToCloseModal,
});

const mapDispatchToProps = (dispatch) => ({
  onCloseModal: () => dispatch(logout()),
  keepUserLogged: () => dispatch(keepUserLogged()),
});

const connectedComponent = connect<{}, {}, IKeepMeLoggedModalProps>(mapStateToProps, mapDispatchToProps)(KeepMeLoggedModalComponent);

export const KeepMeLoggedModal = withStyles(modalStyles)(connectedComponent);
