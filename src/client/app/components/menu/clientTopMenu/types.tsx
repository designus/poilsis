import { RouteComponentProps } from 'react-router-dom';
import { Locale } from 'global-utils/typings';
import { City } from 'global-utils/data-models';
import { ActiveItem } from 'types';

export interface IOwnProps extends RouteComponentProps<any> {
  onRouteChange?: () => void;
  login?: (credentials: any) => void;
  isVertical?: boolean;
  isLoggedIn?: boolean;
}

export interface IStateProps {
  locale: Locale;
  cities: City[];
  selectedCityId?: string;
  activeItem: ActiveItem;
}

export type ITopMenuProps = IStateProps & IOwnProps;
