import { RouteComponentProps } from 'react-router-dom';
import { IItem, Languages } from 'global-utils/typings';

export interface IMatchParams {
  locale: Languages;
  cityAlias: string;
  itemAlias: string;
}

export interface IOwnProps extends RouteComponentProps<IMatchParams> {}

export interface IStateProps {
  selectedItem?: IItem;
}

export interface IDispatchProps {
  loadItem?: (locale: Languages, alias: string) => void;
  selectItem?: (itemId: string) => void;
}

export type ItemPageProps = IOwnProps & IStateProps & IDispatchProps;
