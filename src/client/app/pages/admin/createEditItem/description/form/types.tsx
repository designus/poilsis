import { InjectedFormProps } from 'redux-form';
import { IntlShape } from 'react-intl';
import { WithStyles } from '@material-ui/core/styles';
import { Locale, IItemDescFields } from 'global-utils/typings';

import { styles } from './styles';

export interface ICustomProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  selectedLanguage?: Locale;
}

export type Props = ICustomProps & InjectedFormProps<IItemDescFields, ICustomProps>;
