import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Countdown from 'react-countdown-now';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import { IAppState } from 'types';
import { DIALOG_LOADER_ID } from 'client-utils/constants';
import { logout, reauthenticateUser } from 'actions/auth';
import { getSessionExpiryTime } from 'selectors';
import { styles } from '../styles';
import { Header, Content, Footer } from '../shared';

export interface IKeepMeLoggedModalProps extends WithStyles<typeof styles> {
  isModalOpen?: boolean;
  sessionExpiryTime?: number;
  onCloseModal?: () => void;
  reauthenticateUser?: () => void;
}

class KeepMeLoggedModalComponent extends React.PureComponent<IKeepMeLoggedModalProps> {

  onCloseModal = () => {
    this.props.onCloseModal();
  }

  renderCountdown = ({ seconds }) => {
    return (
      <FormattedHTMLMessage id="admin.reauthenticate_modal.description" values={{ seconds }} />
    );
  }

  render() {
    const { classes, isModalOpen, reauthenticateUser, sessionExpiryTime } = this.props;

    return (
      <React.Fragment>
        <Dialog
          open={isModalOpen}
          onClose={this.onCloseModal}
          disableBackdropClick={true}
          disableEscapeKeyDown={true}
          classes={{
            paper: classes.paper
          }}
        >
          <Header onClose={this.onCloseModal}>
            <FormattedMessage id="admin.reauthenticate_modal.title" />
          </Header>
          <Content
            showLoadingOverlay={true}
            loaderId={DIALOG_LOADER_ID}
          >
            {sessionExpiryTime &&
              <Countdown
                date={sessionExpiryTime * 1000}
                intervalDelay={0}
                precision={3}
                renderer={this.renderCountdown}
              />
            }
          </Content>
          <Footer
            closeLabelId="common.no"
            submitLabelId="common.yes"
            onClose={this.onCloseModal}
            onSubmit={reauthenticateUser}
          />
        </Dialog>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  sessionExpiryTime: getSessionExpiryTime(state),
  isModalOpen: state.auth.showKeepMeLoggedModal
});

const mapDispatchToProps = (dispatch) => ({
  onCloseModal: () => dispatch(logout()),
  reauthenticateUser: () => dispatch(reauthenticateUser(true))
});

const connectedComponent = connect<{}, {}, IKeepMeLoggedModalProps>(mapStateToProps, mapDispatchToProps)(KeepMeLoggedModalComponent);

export default withStyles(styles)(connectedComponent);
