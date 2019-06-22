import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import ClearIcon from '@material-ui/icons/Clear';
import FileUploadIcon from '@material-ui/icons/CloudUpload';
import Typography from '@material-ui/core/Typography';
import { FormattedMessage } from 'react-intl';

import { Button } from 'components/button';
import { mapMimeTypesToTypes, itemValidation } from 'global-utils';
import { ImageUpload, UploadPlaceholder, UploadButtons } from './style';

const { images: { maxPhotos, maxPhotoSizeMegabytes, mimeTypes } } = itemValidation;

export interface IFileUploadProps {
  onDrop: (acceptedImages: File[], rejectedImages?: File[]) => void;
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

  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    accept: mimeTypes.join(','),
    onDrop,
  });

  return (
    <ImageUpload>
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        {children}
        <UploadPlaceholder>
          <Typography variant="body1">
            <FormattedMessage id="admin.file_upload.placeholder"  />
          </Typography>
        </UploadPlaceholder>
      </div>
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
