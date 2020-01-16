import { WithStyles } from '@material-ui/core/styles';
import { WrappedComponentProps as InjectedIntlProps } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import { getInitialData } from 'actions/initialData';
import { ThunkReturn } from 'types';
import { Languages } from 'global-utils/typings';

import { styles } from './styles';

export interface IOwnProps extends WithStyles<typeof styles>, InjectedIntlProps, RouteComponentProps<any> {}

export interface IStateProps {
  adminLocale: Languages;
  clientLocale: Languages;
}

export interface IDispatchProps {
  getInitialData: ThunkReturn<typeof getInitialData>;
}

export type AdminLayoutProps = IOwnProps & IStateProps & IDispatchProps;
