import { InjectedFormProps } from 'redux-form';
import { InjectedIntl } from 'react-intl';
import { WithStyles } from '@material-ui/core/styles';

import { styles } from './styles';

export interface ICustomProps extends WithStyles<typeof styles> {
  intl: InjectedIntl;
  selectedLanguage?: string;
}

export type Props = ICustomProps & InjectedFormProps<{}, ICustomProps>;
