import { InjectedFormProps } from 'redux-form';
import { IntlShape } from 'react-intl';
import { Image } from 'data-models';

export interface ICustomProps {
  images: Image[];
  onResetUploadState: () => void;
  onSaveImages: (images: Image[]) => void;
  onSortImages: (images: Image[]) => void;
  intl: IntlShape;
}

export type Props = ICustomProps & InjectedFormProps<{}, ICustomProps>;
