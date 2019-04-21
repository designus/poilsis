import * as React from 'react';
import { WrappedFieldProps, submit } from 'redux-form';
import { WithStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux';
import { FileUpload, ImagePreview } from 'components';
import { IAppState, IUploadProgress } from 'reducers';
import { setInitialUploadState } from 'actions';
import { styles } from './styles';

export interface IUploadedPhotosParams extends WrappedFieldProps, WithStyles<typeof styles>, IUploadProgress {
  formName: string;
  uploadImages: () => void;
  clearDroppedImages: () => void;
}

function DropzoneInput(props: IUploadedPhotosParams) {

  const { meta, input, clearDroppedImages, uploadImages, hasError, progress, isUploaded, isUploading } = props;
  const hasValidationError = Boolean(meta.invalid && meta.error);

  const onDeleteImage = (index: number) => (e: any) => {
    e.stopPropagation();
    const files = [...input.value];
    files.splice(index, 1);
    input.onChange(files);
  };

  const onDrop = (acceptedFiles: File[]) => {
    const files = input.value;
    const newFiles = [...files, ...acceptedFiles];
    input.onChange(extendFilesWithPreview(newFiles));
  };

  const extendFilesWithPreview = (files: File[]) => files.map((file: File) => ({...file, preview: URL.createObjectURL(file)}));

  return (
    <Tooltip open={hasValidationError} title={meta.error || ''} placement="top-end">
      <FileUpload
        onDrop={onDrop}
        showUploadButtons={input.value.length}
        clearImages={clearDroppedImages}
        hasValidationError={hasValidationError}
        uploadImages={uploadImages}
      >
        <ImagePreview
          images={input.value}
          onDeleteImage={onDeleteImage}
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

export default withStyles(styles)(
  connect<any, any, IUploadedPhotosParams>(mapStateToProps, mapDispatchToProps)(DropzoneInput),
) as any;
