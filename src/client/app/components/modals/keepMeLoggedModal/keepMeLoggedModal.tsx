import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Countdown from 'react-countdown-now';

import { IAppState } from 'reducers';
import { DIALOG_LOADER_ID } from 'client-utils';
import { logout, reauthenticateUser } from 'actions';
import { getAccessTokenClaims } from 'global-utils';
import { modalStyles } from '../styles';
import { DialogHeader, DialogContent, DialogFooter } from '../shared';

export interface IKeepMeLoggedModalProps extends WithStyles<typeof modalStyles> {
  isModalOpen?: boolean;
  accessToken?: string;
  onCloseModal?: () => void;
  reauthenticateUser?: () => void;
}

class KeepMeLoggedModalComponent extends React.PureComponent<IKeepMeLoggedModalProps, any> {

  onCloseModal = () => {
    this.props.onCloseModal();
  }

  renderCountdown = ({ seconds }) => {
    return (
      <span>Your login session will expire in <strong>{seconds}</strong> seconds. Do you want us to keep you logged in?</span>
    );
  }

  render() {
    const { classes, isModalOpen, reauthenticateUser, accessToken } = this.props;
    const expires = accessToken ? getAccessTokenClaims(accessToken).expires : null;

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
            showLoadingOverlay={true}
            loaderId={DIALOG_LOADER_ID}
            contentClass={classes.dialogContent}
          >
            {expires &&
              <Countdown
                date={expires * 1000}
                intervalDelay={0}
                precision={3}
                renderer={this.renderCountdown}
              />
            }
          </DialogContent>
          <DialogFooter
            classes={classes}
            closeLabel="No"
            submitLabel="Yes"
            onClose={this.onCloseModal}
            onSubmit={reauthenticateUser}
          />
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  accessToken: state.auth.accessToken,
  isModalOpen: state.auth.showKeepMeLoggedModal,
});

const mapDispatchToProps = (dispatch) => ({
  onCloseModal: () => dispatch(logout()),
  reauthenticateUser: () => dispatch(reauthenticateUser()),
});

const connectedComponent = connect<{}, {}, IKeepMeLoggedModalProps>(mapStateToProps, mapDispatchToProps)(KeepMeLoggedModalComponent);

export const KeepMeLoggedModal = withStyles(modalStyles)(connectedComponent);
