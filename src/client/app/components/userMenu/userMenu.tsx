import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountIcon from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Countdown from 'react-countdown-now';
import { throttle } from 'lodash';

import { getAccessTokenClaims, REAUTHENTICATE_DURATION_SECONDS } from 'global-utils';
import { logout, showKeepMeLoggedModal } from 'actions/auth';
import { getSessionExpiryTime } from 'selectors';
import { IAppState } from 'reducers';
import { ICurrentUser } from 'types';
import { DropdownMenu } from 'components/dropdownMenu';
import { styles } from './styles';

interface IMenuComponentProps extends WithStyles<typeof styles> {
  currentUser?: ICurrentUser;
  isLoggedIn?: boolean;
  isInverted?: boolean;
  sessionExpiryTime?: number;
  isKeepMeLoggedModalVisible?: boolean;
  logout?: () => void;
  showKeepMeLoggedModal?: () => void;
}

export class UserMenu extends React.Component<IMenuComponentProps, any> {

  handleTick = (props) => {
    if (props.minutes === 0 && props.seconds <= REAUTHENTICATE_DURATION_SECONDS && !this.props.isKeepMeLoggedModalVisible) {
      this.props.showKeepMeLoggedModal();
    } else if (props.minutes === 0 && props.seconds === 0) {
      this.props.logout();
    }
  }

  onTick = throttle(this.handleTick, 1000);

  onComplete = () => {
    this.props.logout();
  }

  renderCountdown = ({ minutes, seconds }) => {
    return (
      <Typography color="inherit" variant="body1" className={this.props.classes.sessionTimer}>
        {minutes}:{seconds}
      </Typography>
    );
  }

  getDropdownParentItem = () => {
    const { classes, isInverted } = this.props;
    const { icon, iconRegular, iconInverted } = classes; 
    return (
      <IconButton
        aria-label="More"
        aria-owns="Open right Menu"
        aria-haspopup="true"
      >
        <AccountIcon className={`${icon} ${isInverted ? iconInverted : iconRegular}`} />
      </IconButton>
    )
  }

  render() {
    const { currentUser, isLoggedIn } = this.props;
    if (!currentUser || !isLoggedIn) return null;

    return (
      <div className={this.props.classes.wrapper}>
        <Countdown
          date={this.props.sessionExpiryTime * 1000}
          intervalDelay={0}
          precision={3}
          renderer={this.renderCountdown}
          onTick={this.onTick}
        />
        <Typography color="inherit" variant="body1" align="right">
          Hello, {this.props.currentUser.name}
        </Typography>
        <DropdownMenu
          id="menuRight"
          parentItem={this.getDropdownParentItem()}
        >
          <MenuItem>My account</MenuItem>
          <MenuItem onClick={this.props.logout}>Logout</MenuItem>
        </DropdownMenu>
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  isKeepMeLoggedModalVisible: state.auth.showKeepMeLoggedModal,
  currentUser: state.currentUser.details,
  sessionExpiryTime: getSessionExpiryTime(state)
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  showKeepMeLoggedModal: () => dispatch(showKeepMeLoggedModal())
});

export default withStyles(styles)(
  connect<any, any, IMenuComponentProps>(mapStateToProps, mapDispatchToProps)(UserMenu)
);
