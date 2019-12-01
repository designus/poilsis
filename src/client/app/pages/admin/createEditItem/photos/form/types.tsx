import { InjectedFormProps } from 'redux-form';
import { InjectedIntl } from 'react-intl';
import { IImage } from 'global-utils/typings';

export interface ICustomProps {
  images: IImage[];
  onResetUploadState: () => void;
  onSaveImages: (images: IImage[]) => void;
  onSortImages: (images: IImage[]) => void;
  intl: InjectedIntl;
}

export type Props = ICustomProps & InjectedFormProps<{}, ICustomProps>;
