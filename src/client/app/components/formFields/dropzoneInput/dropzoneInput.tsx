import * as React from 'react';
import { WrappedFieldProps, submit } from 'redux-form';
import { WithStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux';
import { ImageFile } from 'react-dropzone';
import { FileUpload, ImagePreview } from 'components';
import { IAppState, IUploadProgress } from 'reducers';
import { setInitialUploadState } from 'actions';
import { styles } from './styles';

export interface IUploadedPhotosParams extends WrappedFieldProps, WithStyles<typeof styles>, IUploadProgress {
  formName: string;
  uploadImages: () => void;
  clearDroppedImages: () => void;
}

class DropzoneInputComponent extends React.Component<IUploadedPhotosParams, any> {

  onDeleteImage = (index: number) => (e: any) => {
    e.stopPropagation();
    const files = [...this.props.input.value];
    files.splice(index, 1);
    this.props.input.onChange(files);
  }

  onDrop = (acceptedFiles: ImageFile[], rejectedFiles: ImageFile[]) => {
    const files = this.props.input.value;
    const newFiles = [...files, ...acceptedFiles];
    this.props.input.onChange(newFiles);
  }

  render() {
    const { meta, input, clearDroppedImages, uploadImages, hasError, progress, isUploaded, isUploading } = this.props;
    const hasValidationError = Boolean(meta.invalid && meta.error);
    return (
      <Tooltip open={hasValidationError} title={meta.error || ''} placement="top-end">
        <FileUpload
          onDrop={this.onDrop}
          showUploadButtons={input.value.length}
          clearImages={clearDroppedImages}
          hasValidationError={hasValidationError}
          uploadImages={uploadImages}
        >
          <ImagePreview
            images={input.value}
            onDeleteImage={this.onDeleteImage}
            hasError={hasError}
            progress={progress}
            isUploaded={isUploaded}
            isUploading={isUploading}
            isTemporary={true}
          />
        </FileUpload>
      </Tooltip>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  progress: state.uploadProgress.progress,
  isUploaded: state.uploadProgress.isUploaded,
  isUploading: state.uploadProgress.isUploading,
  hasError: state.uploadProgress.hasError,
});

const mapDispatchToProps = (dispatch, props: IUploadedPhotosParams) => ({
  setInitialUploadState: () => dispatch(setInitialUploadState()),
  uploadImages: () => dispatch(submit(props.formName)),
});

const connectedComponent = connect<any, any, IUploadedPhotosParams>(mapStateToProps, mapDispatchToProps)(DropzoneInputComponent);

export const DropzoneInput = withStyles(styles)(connectedComponent) as any;
