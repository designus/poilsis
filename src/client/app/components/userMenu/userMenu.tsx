import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountIcon from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Countdown from 'react-countdown-now';
import { throttle } from 'lodash';

import { getAccessTokenClaims, REAUTHENTICATE_DURATION_SECONDS } from 'global-utils';
import { logout, showKeepMeLoggedModal } from 'actions';
import { getSessionExpiryTime } from 'selectors';
import { IAppState, ICurrentUser } from 'reducers';
import { styles } from './styles';

interface IMenuComponentProps extends WithStyles<typeof styles> {
  currentUser?: ICurrentUser;
  sessionExpiryTime?: number;
  isKeepMeLoggedModalVisible?: boolean;
  logout?: () => void;
  showKeepMeLoggedModal?: () => void;
}

export class UserMenu extends React.Component<IMenuComponentProps, any> {

  state = {
    dropdownAnchorEl: null,
    dropdownMenuOpen: false,
  };

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

  handleMenuOpen = event => {
    this.setState({ dropdownMenuOpen: true, dropdownAnchorEl: event.currentTarget });
  }

  handleMenuclose = () => {
    this.setState({ dropdownMenuOpen: false });
  }

  renderCountdown = ({ minutes, seconds }) => {
    return (
      <Typography color="inherit" variant="body1" className={this.props.classes.sessionTimer}>
        {minutes}:{seconds}
      </Typography>
    );
  }

  render() {
    return this.props.currentUser && (
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
        <IconButton
          aria-label="More"
          aria-owns="Open right Menu"
          aria-haspopup="true"
          onClick={this.handleMenuOpen}
        >
          <AccountIcon className={this.props.classes.icon} />
        </IconButton>

        <Menu
          id="menuRight"
          anchorEl={this.state.dropdownAnchorEl}
          open={this.state.dropdownMenuOpen}
          onClose={this.handleMenuclose}
        >
          <div>
            <MenuItem>My account</MenuItem>
            <MenuItem onClick={this.props.logout}>Logout</MenuItem>
          </div>
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  isKeepMeLoggedModalVisible: state.auth.showKeepMeLoggedModal,
  currentUser: state.currentUser.details,
  sessionExpiryTime: getSessionExpiryTime(state),
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  showKeepMeLoggedModal: () => dispatch(showKeepMeLoggedModal()),
});

const connectedComponent = connect<any, any, IMenuComponentProps>(mapStateToProps, mapDispatchToProps)(UserMenu);

export default withStyles(styles)(connectedComponent);
