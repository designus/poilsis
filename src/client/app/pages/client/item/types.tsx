import { RouteComponentProps } from 'react-router-dom';
import { IItem } from 'global-utils/typings';

export interface IMatchParams {
  locale: string;
  cityAlias: string;
  itemAlias: string;
}

export interface IOwnProps extends RouteComponentProps<IMatchParams> {}

export interface IStateProps {
  selectedItem?: IItem;
}

export interface IDispatchProps {
  loadItem?: (locale: string, alias: string) => void;
  selectItem?: (itemId: string) => void;
}

export type ItemPageProps = IOwnProps & IStateProps & IDispatchProps;
