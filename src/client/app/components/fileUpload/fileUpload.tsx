import * as React from 'react';
import Dropzone, { ImageFile } from 'react-dropzone';
import ClearIcon from '@material-ui/icons/Clear';
import FileUploadIcon from '@material-ui/icons/CloudUpload';
import Typography from '@material-ui/core/Typography';
import { FormattedMessage } from 'react-intl';

import { Button } from 'components';
import { mapMimeTypesToTypes, itemValidation } from 'global-utils';
import { ImageUpload, UploadPlaceholder, UploadButtons } from './style';

const { images: { maxPhotos, maxPhotoSizeMegabytes, mimeTypes } } = itemValidation;

export interface IFileUploadProps {
  onDrop: (acceptedImages: ImageFile[], rejectedImages?: ImageFile[]) => void;
  showUploadButtons: boolean;
  hasValidationError: boolean;
  clearImages: () => void;
  uploadImages: () => void;
  children: any;
}

export const FileUpload = ({
  onDrop,
  hasValidationError,
  showUploadButtons,
  clearImages,
  uploadImages,
  children,
}: IFileUploadProps) => {
  return (
    <ImageUpload>
      <Dropzone
        onDrop={onDrop}
        accept={mimeTypes.join(',')}
        className="dropzone"
        activeClassName="active-dropzone"
        name="images"
        multiple={true}>
        {children}
        <UploadPlaceholder>
          <Typography variant="body1">
            <FormattedMessage id="admin.file_upload.placeholder"  />
          </Typography>
        </UploadPlaceholder>
      </Dropzone>
      <Typography variant="caption" gutterBottom>
        <FormattedMessage
          id="admin.file_upload.caption"
          values={{
            count: maxPhotos,
            size: maxPhotoSizeMegabytes,
            types: mapMimeTypesToTypes(mimeTypes),
          }}
        />
      </Typography>
      {showUploadButtons ?
        <UploadButtons>
          <Button
            type="button"
            color="secondary"
            onClick={clearImages}
          >
            <ClearIcon />
            <FormattedMessage id="admin.file_upload.clear_label" />
          </Button>
          <Button
            type="button"
            disabled={hasValidationError}
            onClick={uploadImages}
          >
            <FileUploadIcon />
            <FormattedMessage id="admin.file_upload.upload_label" />
          </Button>
        </UploadButtons> :
        null
      }
    </ImageUpload>
  );
};
