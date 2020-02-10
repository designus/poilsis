import { IItem } from './typings';
import { IMAGE_MIME_TYPES } from './constants';

interface IRules {
  minTextLength: number;
  maxTextLength: number;
  minCheckedCount: number;
  maxCheckedCount: number;
  isRequired: boolean;
  isEmail: boolean;
  maxPhotos: number;
  maxPhotoSizeBytes: number;
  maxPhotoSizeMegabytes: number;
  mimeTypes: string[];
  minPhotoWidth: number;
  minPhotoHeight: number;
}

type ValidationRules = {
  name: Pick<IRules, 'minTextLength'>;
  types: Pick<IRules, 'minCheckedCount' | 'maxCheckedCount'>;
  images: Pick<IRules, 'maxPhotos' | 'maxPhotoSizeMegabytes' | 'maxPhotoSizeBytes' | 'mimeTypes' | 'minPhotoWidth' | 'minPhotoHeight'>
};

export const itemValidation: ValidationRules = {
  name: {
    minTextLength: 3
  },
  types: {
    minCheckedCount: 1,
    maxCheckedCount: 3
  },
  images: {
    maxPhotos: 4,
    maxPhotoSizeMegabytes: 4,
    maxPhotoSizeBytes: 4 * 1024 * 1024,
    mimeTypes: IMAGE_MIME_TYPES,
    minPhotoWidth: 1000,
    minPhotoHeight: 800
  }
};
