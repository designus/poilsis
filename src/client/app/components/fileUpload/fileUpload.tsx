import * as React from 'react';
import Dropzone from 'react-dropzone';
import ClearIcon from '@material-ui/icons/Clear';
import FileUploadIcon from '@material-ui/icons/CloudUpload';
import Typography from '@material-ui/core/Typography';
import { FormattedMessage } from 'react-intl';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import { Button } from 'components/button';
import { mapMimeTypesToTypes, itemValidation } from 'global-utils';
import { styles } from './style';

const { images: { maxPhotos, maxPhotoSizeMegabytes, mimeTypes } } = itemValidation;

export interface IFileUploadProps extends WithStyles<typeof styles> {
  onDrop: (acceptedImages: File[], rejectedImages?: File[]) => void;
  showUploadButtons: boolean;
  hasValidationError: boolean;
  clearImages: () => void;
  uploadImages: () => void;
  children: any;
}

class FileUpload extends React.Component<IFileUploadProps> {
  render() {
    const {
      onDrop,
      hasValidationError,
      showUploadButtons,
      clearImages,
      uploadImages,
      children,
      classes
    } = this.props;
    return (
      <div className={classes.imageUpload}>
        <Dropzone onDrop={onDrop} multiple accept={mimeTypes.join(',')}>
          {({getRootProps, getInputProps}) => (
            <div>
              <div {...getRootProps({className: 'dropzone'})}>
              <input {...getInputProps()} />
              {children}
              <div className={classes.uploadPlaceholder}>
                <Typography variant="body1">
                  <FormattedMessage id="admin.file_upload.placeholder"  />
                </Typography>
              </div>
            </div>
            <Typography variant="caption" gutterBottom>
              <FormattedMessage
                id="admin.file_upload.caption"
                values={{
                  count: maxPhotos,
                  size: maxPhotoSizeMegabytes,
                  types: mapMimeTypesToTypes(mimeTypes)
                }}
              />
            </Typography>
            {showUploadButtons ?
              <div className={classes.uploadButtons}>
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
              </div> :
              null
            }
            </div>
          )}
        </Dropzone>
      </div>
    );
  }
}

export default withStyles(styles)(FileUpload);
