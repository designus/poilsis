import { InjectedIntlProps } from 'react-intl';
import { WithStyles } from '@material-ui/core/styles';
import { IToastState } from 'types';

import { styles } from './styles';

export interface IOwnProps extends WithStyles<typeof styles>, InjectedIntlProps  {}

export interface IDispatchProps {
  hideToast?: () => void;
}

export interface IStateProps {
  toast: IToastState;
}

export type Props = IOwnProps & IStateProps & IDispatchProps;