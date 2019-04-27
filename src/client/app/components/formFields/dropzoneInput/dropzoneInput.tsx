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

interface IFile extends File {
  preview: string;
}

function DropzoneInput(props: IUploadedPhotosParams) {
  const { useState, useEffect } = React;
  const { meta, input, clearDroppedImages, uploadImages, hasError, progress, isUploaded, isUploading } = props;
  const [files, setFiles] = useState(input.value);
  const hasValidationError = Boolean(meta.invalid && meta.error);

  const onDeleteImage = (index: number) => (e: any) => {
    e.stopPropagation();
    const files = [...input.value];
    files.splice(index, 1);
    setFiles(files);
  };

  const onDrop = (acceptedFiles: File[]) => {
    const files = input.value;
    const newFiles = [...files, ...acceptedFiles];

    const newFilesWithPreview = newFiles.map((file: File) => Object.assign(file, { preview: URL.createObjectURL(file) }));
    setFiles(newFilesWithPreview);
  };

  useEffect(() => {
    input.onChange(files);
  }, [files]);

  useEffect(() => () => {
    files.forEach((file: IFile) => URL.revokeObjectURL(file.preview));
  }, []);

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
          images={files}
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
