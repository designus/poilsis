import { InjectedFormProps } from 'redux-form';
import { InjectedIntl } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import { WithStyles } from '@material-ui/core/styles';
import { ItemPageMatchParams } from '../../types';

import { styles } from './styles';

export interface ICustomProps extends WithStyles<typeof styles>, RouteComponentProps<ItemPageMatchParams> {
  intl: InjectedIntl;
  selectedLanguage?: string;
}

export type Props = ICustomProps & InjectedFormProps<{}, ICustomProps>;
