import { TItemFields } from './typings';

interface IRules {
  minTextLength?: number;
  maxTextLength?: number;
  minCheckedCount?: number;
  maxCheckedCount?: number;
  isRequired?: boolean;
  isEmail?: boolean;
  maxPhotos?: number;
  maxPhotoSizeBytes?: number;
  maxPhotoSizeMegabytes?: number;
  mimeTypes?: string[];
}

type ValidationRules = {
  [P in keyof TItemFields]?: IRules;
};

export const itemValidation: ValidationRules = {
  name: {
    minTextLength: 3,
  },
  types: {
    minCheckedCount: 1,
    maxCheckedCount: 3,
  },
  images: {
    maxPhotos: 4,
    maxPhotoSizeMegabytes: 2,
    maxPhotoSizeBytes: 2 * 1024 * 1024,
    mimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
  },
};
