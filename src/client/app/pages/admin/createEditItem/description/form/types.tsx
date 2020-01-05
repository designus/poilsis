import { InjectedFormProps } from 'redux-form';
import { IntlShape } from 'react-intl';
import { WithStyles } from '@material-ui/core/styles';

import { styles } from './styles';

export interface ICustomProps extends WithStyles<typeof styles> {
  intl: IntlShape;
  selectedLanguage?: string;
}

export type Props = ICustomProps & InjectedFormProps<{}, ICustomProps>;
