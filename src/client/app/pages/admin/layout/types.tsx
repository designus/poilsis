import { WithStyles } from '@material-ui/core/styles';
import { InjectedIntlProps } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import { IGetInitialDataParams } from 'actions/initialData';

import { styles } from './styles';

export interface IOwnProps extends WithStyles<typeof styles>, InjectedIntlProps, RouteComponentProps<object> {}

export interface IStateProps {
  adminLocale: string;
  clientLocale: string;
}

export interface IDispatchProps {
  getInitialData: (params?: IGetInitialDataParams) => void;
}

export type AdminLayoutProps = IOwnProps & IStateProps & IDispatchProps;
