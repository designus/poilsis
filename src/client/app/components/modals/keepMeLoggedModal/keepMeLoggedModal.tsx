import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Countdown from 'react-countdown-now';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

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
      <FormattedHTMLMessage id="admin.reauthenticate_modal.description" values={{ seconds }} />
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
            className={classes.close}
            closeModal={this.onCloseModal}
          >
            <FormattedMessage id="admin.reauthenticate_modal.title" />
          </DialogHeader>
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
            closeLabelId="common.no"
            submitLabelId="common.yes"
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
