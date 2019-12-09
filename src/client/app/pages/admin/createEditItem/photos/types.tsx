import { InjectedIntlProps } from 'react-intl';
import { IPhotoFormState, IImage } from 'global-utils/typings';
import { IReceiveImages, ThunkReturn } from 'types';
import { updatePhotos, uploadPhotos, receiveImages } from 'actions/items';

import { CreateEditItemProps } from '../types';

export interface IOwnProps extends CreateEditItemProps, IPhotoFormState, InjectedIntlProps {}

export interface IDispatchProps {
  uploadImages: ThunkReturn<typeof uploadPhotos>;
  updateImages: ThunkReturn<typeof updatePhotos>;
  resetUploadState: () => void;
  sortImages: (id: string) => (image: IImage[]) => void;
}

export type Props = IOwnProps & IDispatchProps;
