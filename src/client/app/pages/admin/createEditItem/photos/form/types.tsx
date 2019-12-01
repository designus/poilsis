import { InjectedFormProps } from 'redux-form';
import { RouteComponentProps } from 'react-router-dom';
import { InjectedIntl } from 'react-intl';
import { IImage } from 'global-utils/typings';
import { ItemPageMatchParams } from '../../types';

export interface ICustomProps extends RouteComponentProps<ItemPageMatchParams> {
  images: IImage[];
  onResetUploadState: () => void;
  onSaveImages: (images: IImage[]) => void;
  onSortImages: (images: IImage[]) => void;
  intl: InjectedIntl;
}

export type Props = ICustomProps & InjectedFormProps<{}, ICustomProps>;
