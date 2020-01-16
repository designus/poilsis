import { RouteComponentProps } from 'react-router-dom';
import { WithStyles } from '@material-ui/core/styles';
import { Languages } from 'global-utils/typings';
import { getInitialData } from 'actions/initialData';
import { ThunkReturn } from 'types';

import { styles } from './styles';

export type State = {
  mobileDrawerOpen: boolean;
};

export interface IMatchParams {
  locale: Languages;
}

export type OwnProps = RouteComponentProps<IMatchParams> & WithStyles<typeof styles>;

export type StateProps = {
  isLoggedIn: boolean;
  locale: Languages;
  isInitialDataLoaded: boolean;
};

export type DispatchProps = {
  getInitialData: ThunkReturn<typeof getInitialData>;
};

export type Props = OwnProps & StateProps & DispatchProps;
