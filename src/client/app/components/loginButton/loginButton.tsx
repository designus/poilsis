import * as React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Fab from '@material-ui/core/Fab';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { injectIntl, FormattedMessage, InjectedIntlProps } from 'react-intl';

import { isLoggedIn } from 'selectors';
import { DropdownMenu } from 'components/dropdownMenu';
import { login } from 'actions/auth';

import { styles } from './styles';
import { IAppState } from 'reducers';

interface IOwnProps extends WithStyles<typeof styles>, InjectedIntlProps {}

interface IDispatchProps {
  login: (credentials: any) => any;
}

interface IStateProps {
  isLoggedIn: boolean;
}

type ILoginButtonProps = IOwnProps & IStateProps & IDispatchProps;

const translation = {
  id: 'common.login',
  defaultMessage: 'Login'
};

function LoginButton(props: ILoginButtonProps) {
  const { login, isLoggedIn } = props;
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
      aria-label={props.intl.formatMessage(translation)}
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
}

const mapStateToProps = (state: IAppState) => ({
  isLoggedIn: isLoggedIn(state)
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
  login: (credentials) => dispatch(login(credentials))
});

export default connect<IStateProps, IDispatchProps, {}>(mapStateToProps, mapDispatchToProps)(
  injectIntl(withStyles(styles)(LoginButton))
);
