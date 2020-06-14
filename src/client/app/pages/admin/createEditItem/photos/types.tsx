import { WrappedComponentProps as InjectedIntlProps } from 'react-intl';
import { IPhotoFormState } from 'global-utils/typings';
import { Image } from 'global-utils/data-models';
import { ThunkReturn } from 'types';
import { updatePhotos, uploadPhotos } from 'actions/items';

import { CreateEditItemProps } from '../types';

export interface IOwnProps extends CreateEditItemProps, IPhotoFormState, InjectedIntlProps {}

export interface IDispatchProps {
  uploadImages: ThunkReturn<typeof uploadPhotos>;
  updateImages: ThunkReturn<typeof updatePhotos>;
  resetUploadState: () => void;
  sortImages: (id: string) => (image: Image[]) => void;
}

export type Props = IOwnProps & IDispatchProps;
