import * as React from 'react';
import Dropzone from 'react-dropzone';
import { ImageUpload, UploadPlaceholder, UploadButtons } from './style';
import { Button } from '../../components';
import { START_UPLOAD, UPLOAD_PLACEHOLDER, CLEAR_IMAGES } from '../../../../data-strings';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_B } from '../../../../global-utils';
import FileUploadIcon from '@material-ui/icons/FileUpload';
import ClearIcon from '@material-ui/icons/Clear';
import Typography from '@material-ui/core/Typography';
export interface IFileUploadProps {
  onDrop: (acceptedImages: any[], rejectedImages?: any[]) => void;
  showUploadButtons: boolean;
  clearImages: () => void;
  uploadImages: () => void;
  children: any;
}

export const FileUpload = ({onDrop, showUploadButtons, clearImages, uploadImages, children}: IFileUploadProps) => {
  return (
    <ImageUpload>
      <Dropzone
        onDrop={onDrop}
        accept={ALLOWED_MIME_TYPES.join(',')}
        maxSize={MAX_FILE_SIZE_B}
        className="dropzone"
        activeClassName="active-dropzone"
        name="images"
        multiple={true}>
        {children}
        <UploadPlaceholder>
          <Typography variant="body1">
            {UPLOAD_PLACEHOLDER}
          </Typography>
        </UploadPlaceholder>
      </Dropzone>
      {showUploadButtons ?
        <UploadButtons>
          <Button
            type="button"
            color="secondary"
            onClick={clearImages}
            style={{margin: '0 2px 0 0'}}
          >
            <ClearIcon />
            {CLEAR_IMAGES}
          </Button>
          <Button type="button" onClick={uploadImages} style={{margin: '0 0 0 2px'}}>
            <FileUploadIcon />
            {START_UPLOAD}
          </Button>
        </UploadButtons> :
        null
      }
    </ImageUpload>
  );
};
