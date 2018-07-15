import * as React from 'react';
import { WrappedFieldProps, submit } from 'redux-form';
import { WithStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {
  FileUpload,
  ImagePreview,
} from 'components';
import { IAppState, IUploadProgress } from 'reducers';
import { setInitialUploadState } from 'actions';
import { styles } from './styles';

export interface IUploadedPhotosParams extends WrappedFieldProps, WithStyles<typeof styles>, IUploadProgress {
  formName: string;
  uploadImages: any;
  clearDroppedImages: any;
}

class DropzoneInputComponent extends React.Component<IUploadedPhotosParams, any> {

  onDeleteImage = (index: number) => (e: any) => {
    e.stopPropagation();
    const files = this.props.input.value;
    files.splice(index, 1);
    this.props.input.onChange(files);
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    const files = this.props.input.value;
    const newFiles = [...files, ...acceptedFiles];
    this.props.input.onChange(newFiles);
  }

  render() {
    console.log('Props', this.props);
    return (
      <div>
        <FileUpload
          onDrop={this.onDrop}
          showUploadButtons={this.props.input.value.length}
          clearImages={this.props.clearDroppedImages}
          uploadImages={this.props.uploadImages}
        >
          <ImagePreview
            images={this.props.input.value}
            onDeleteImage={this.onDeleteImage}
            hasError={this.props.hasError}
            progress={this.props.progress}
            isUploaded={this.props.isUploaded}
            isUploading={this.props.isUploading}
            isTemporary={true}
          />
        </FileUpload>
      </div>
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
