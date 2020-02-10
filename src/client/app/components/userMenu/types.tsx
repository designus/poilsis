import { WithStyles } from '@material-ui/core/styles';
import { UserDetails } from 'types';

import { styles } from './styles';

export interface IOwnProps extends WithStyles<typeof styles> {
  isLoggedIn?: boolean;
  isInverted?: boolean;
}

export interface IStateProps {
  currentUser: UserDetails | null;
  sessionExpiryTime: number | null;
  isKeepMeLoggedModalVisible: boolean;
}

export interface IDispatchProps {
  logout: () => void;
  showKeepMeLoggedModal: () => void;
}

export type Props = IOwnProps & IStateProps & IDispatchProps;
