import { RouteComponentProps } from 'react-router-dom';
import { ICity, Locale } from 'global-utils/typings';
import { ActiveItem } from 'types';

export interface IOwnProps extends RouteComponentProps<any> {
  onRouteChange?: () => void;
  login?: (credentials: any) => void;
  isVertical?: boolean;
  isLoggedIn?: boolean;
}

export interface IStateProps {
  locale: Locale;
  cities: ICity[];
  selectedCityId?: string;
  activeItem: ActiveItem;
}

export type ITopMenuProps = IStateProps & IOwnProps;
