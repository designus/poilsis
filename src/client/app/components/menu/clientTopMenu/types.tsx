import { RouteComponentProps } from 'react-router-dom';
import { WithStyles } from '@material-ui/core/styles';
import { WrappedComponentProps as InjectedIntlProps } from 'react-intl';
import { ICity } from 'global-utils/typings';
import { ActiveItem } from 'types';
import { styles } from './styles';

export interface IOwnProps extends RouteComponentProps<any>, WithStyles<typeof styles>, InjectedIntlProps {
  onRouteChange?: () => void;
  login?: (credentials: any) => void;
  isVertical?: boolean;
  isLoggedIn?: boolean;
}

export interface IStateProps {
  locale?: string;
  cities?: ICity[];
  selectedCityId?: string;
  activeItem: ActiveItem;
}

export type ITopMenuProps = IStateProps & IOwnProps;
