import { WrappedComponentProps as InjectedIntlProps } from 'react-intl';
import { IPhotoFormState, IImage } from 'global-utils/typings';
import { ThunkReturn } from 'types';
import { updatePhotos, uploadPhotos } from 'actions/items';

import { CreateEditItemProps } from '../types';

export interface IOwnProps extends CreateEditItemProps, IPhotoFormState, InjectedIntlProps {}

export interface IDispatchProps {
  uploadImages: ThunkReturn<typeof uploadPhotos>;
  updateImages: ThunkReturn<typeof updatePhotos>;
  resetUploadState: () => void;
  sortImages: (id: string) => (image: IImage[]) => void;
}

export type Props = IOwnProps & IDispatchProps;
