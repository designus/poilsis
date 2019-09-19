import { WithStyles } from '@material-ui/core/styles';
import { RouteComponentProps } from 'react-router-dom';
import { styles } from './styles';

export interface IOwnProps extends Partial<WithStyles<typeof styles>>, RouteComponentProps<any> {
  locale: string;
  isAdmin: boolean;
}

export interface IDispatchProps {
  onSelectLanguage: (locale: string, isAdmin: boolean) => () => void;
}

export type LanguageSelectorProps = IOwnProps & IDispatchProps;
