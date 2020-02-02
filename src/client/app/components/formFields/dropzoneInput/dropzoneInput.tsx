import * as React from 'react';
import { WrappedFieldProps } from 'redux-form';
// @ts-ignore
import reduxFormActions from 'redux-form/es/actions';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux';
import { IUploadProgressState, IAppState, ThunkDispatch } from 'types';

import { FileUpload } from 'components/fileUpload';
import { ImagePreview } from 'components/imagePreview';

import { styles } from './styles';

const { submit } = reduxFormActions;

interface IOwnProps extends WrappedFieldProps, WithStyles<typeof styles> {
  formName: string;
  clearDroppedImages: () => void;
}

interface IStateProps extends IUploadProgressState {}

interface IDispatchProps {
  uploadImages: () => void;
}

type Props = IOwnProps & IStateProps & IDispatchProps;

interface IFile extends File {
  preview: string;
}

const DropzoneInput: React.FunctionComponent<Props> = props => {
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
    const files = input.value || [];
    const newFiles = [...files, ...acceptedFiles];
    const newFilesWithPreview = newFiles.map((file: File) => Object.assign(file, { preview: URL.createObjectURL(file) }));
    setFiles(newFilesWithPreview);
  };

  useEffect(() => {
    input.onChange(files);
  }, [files]);

  useEffect(() => {
    setFiles(input.value);
  }, [input.value]);

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

const mapStateToProps = (state: IAppState): IStateProps => ({
  progress: state.uploadProgress.progress,
  isUploaded: state.uploadProgress.isUploaded,
  isUploading: state.uploadProgress.isUploading,
  hasError: state.uploadProgress.hasError
});

const mapDispatchToProps = (dispatch: ThunkDispatch, props: IOwnProps): IDispatchProps => ({
  uploadImages: () => dispatch(submit(props.formName))
});

export default withStyles(styles)(
  connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(mapStateToProps, mapDispatchToProps)(DropzoneInput)
) as any;
