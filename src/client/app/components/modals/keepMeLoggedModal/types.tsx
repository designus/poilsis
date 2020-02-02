import { WithStyles } from '@material-ui/core/styles';
import { styles } from '../styles';

export interface IOwnProps extends WithStyles<typeof styles> {}

export interface IStateProps {
  isModalOpen?: boolean;
  sessionExpiryTime?: number;
}

export interface IDispatchProps {
  onCloseModal?: () => void;
  reauthenticateUser?: () => void;
}

export type Props = IOwnProps & IStateProps & IDispatchProps;
