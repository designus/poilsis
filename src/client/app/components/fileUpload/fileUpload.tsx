import * as React from 'react';
import Dropzone, { ImageFile } from 'react-dropzone';
import ClearIcon from '@material-ui/icons/Clear';
import FileUploadIcon from '@material-ui/icons/FileUpload';
import Typography from '@material-ui/core/Typography';

import { Button } from 'components';
import { ALLOWED_MIME_TYPES, MAX_FILE_COUNT, MAX_FILE_SIZE_MB, mapMimeTypesToTypes } from 'global-utils';
import { ImageUpload, UploadPlaceholder, UploadButtons } from './style';
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
        accept={ALLOWED_MIME_TYPES.join(',')}
        className="dropzone"
        activeClassName="active-dropzone"
        name="images"
        multiple={true}>
        {children}
        <UploadPlaceholder>
          <Typography variant="body1">
            Drag and drop or click to select a 550x550px file to upload.
          </Typography>
        </UploadPlaceholder>
      </Dropzone>
      <Typography variant="caption" gutterBottom>
        {`
          Please select no more than ${MAX_FILE_COUNT} photos.
          Each photo should not be bigger than ${MAX_FILE_SIZE_MB} mb
          and have one of the type: ${mapMimeTypesToTypes(ALLOWED_MIME_TYPES)}
        `}
      </Typography>
      {showUploadButtons ?
        <UploadButtons>
          <Button
            type="button"
            color="secondary"
            onClick={clearImages}
          >
            <ClearIcon />
            Clear images
          </Button>
          <Button
            type="button"
            disabled={hasValidationError}
            onClick={uploadImages}
          >
            <FileUploadIcon />
            Upload
          </Button>
        </UploadButtons> :
        null
      }
    </ImageUpload>
  );
};
