import { RouteComponentProps } from 'react-router-dom';
import { WithStyles } from '@material-ui/core/styles';
import { Locale } from 'global-utils/typings';
import { getInitialData } from 'actions/initialData';
import { ThunkReturn } from 'types';

import { styles } from './styles';

export interface IMatchParams {
  locale: Locale;
}

export type OwnProps = RouteComponentProps<IMatchParams> & WithStyles<typeof styles>;

export type StateProps = {
  isLoggedIn: boolean;
  locale: Locale;
  isInitialDataLoaded: boolean;
};

export type DispatchProps = {
  getInitialData: ThunkReturn<typeof getInitialData>;
};

export type Props = OwnProps & StateProps & DispatchProps;
