import { WithStyles } from '@material-ui/core/styles';
import { RouteComponentProps } from 'react-router-dom';
import { Locale } from 'global-utils/typings';
import { styles } from './styles';

export interface IOwnProps extends WithStyles<typeof styles>, RouteComponentProps<any> {
  locale: Locale;
  isAdmin: boolean;
}

export interface IDispatchProps {
  onSelectLanguage: (locale: Locale, isAdmin: boolean) => () => void;
}

export type LanguageSelectorProps = IOwnProps & IDispatchProps;
