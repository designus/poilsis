import * as React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Fab from '@material-ui/core/Fab';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { FormattedMessage, useIntl } from 'react-intl';

import { isLoggedIn } from 'selectors';
import { ThunkDispatch, IAppState } from 'types';
import { DropdownMenu } from 'components/dropdownMenu';
import { login } from 'actions/auth';

import { styles } from './styles';

interface IOwnProps extends WithStyles<typeof styles> {}

interface IDispatchProps {
  login: (credentials: any) => any;
}

interface IStateProps {
  isLoggedIn: boolean;
}

type Props = IOwnProps & IStateProps & IDispatchProps;

const translation = {
  id: 'common.login',
  defaultMessage: 'Login'
};

const LoginButton: React.FunctionComponent<Props> = props => {
  const { login, isLoggedIn } = props;
  const intl = useIntl();
  const signIn = (credentials: any) => () => {
    login(credentials);
  };

  const getButton = () => (
    <Fab
      classes={{
        root: props.classes.button
      }}
      color="default"
      variant="extended"
      size="small"
      aria-label={intl.formatMessage(translation)}
    >
      <FontAwesomeIcon icon={['far', 'user']} />&nbsp;
      <FormattedMessage {...translation} />
    </Fab>
  );

  return !isLoggedIn && (
    <DropdownMenu
      className={props.classes.dropdownMenu}
      parentItem={getButton()}
      id={`menu-login`}
    >
      <MenuItem onClick={signIn({username: 'admin', password: 'admin'})}>Admin</MenuItem>
      <MenuItem onClick={signIn({username: 'tomas', password: 'tomas'})}>User</MenuItem>
    </DropdownMenu>
  );
};

const mapStateToProps = (state: IAppState): IStateProps => ({
  isLoggedIn: isLoggedIn(state)
});

const mapDispatchToProps = (dispatch: ThunkDispatch): IDispatchProps => ({
  login: (credentials) => dispatch(login(credentials))
});

export default withStyles(styles)(
  connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(mapStateToProps, mapDispatchToProps)(LoginButton)
);
