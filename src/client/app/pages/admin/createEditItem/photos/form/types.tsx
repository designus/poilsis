import { InjectedFormProps } from 'redux-form';
import { IntlShape } from 'react-intl';
import { IImage } from 'global-utils/typings';

export interface ICustomProps {
  images: IImage[];
  onResetUploadState: () => void;
  onSaveImages: (images: IImage[]) => void;
  onSortImages: (images: IImage[]) => void;
  intl: IntlShape;
}

export type Props = ICustomProps & InjectedFormProps<{}, ICustomProps>;
