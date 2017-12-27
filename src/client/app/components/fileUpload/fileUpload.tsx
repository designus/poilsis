import * as React from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { ImageUpload, UploadPlaceholder } from './style';
import { InputLabel } from 'material-ui/Input';
import { ImagePreview, Button } from '../../components';
import { IAppState, IUploadProgress  } from '../../reducers';
import { IImage } from 'global-utils';
import { START_UPLOAD, UPLOAD_PLACEHOLDER } from '../../../../data-strings';
import FileUploadIcon from 'material-ui-icons/FileUpload';

export interface IFileUploadProps extends IUploadProgress {
  label: string;
  isCreate: boolean;
  id: string;
  images: IImage[];
  addImages: (images: any[]) => void;
  uploadImages: (itemId: string, files: any[]) => Promise<any>;
};

class FileUploadComponent extends React.Component<IFileUploadProps, any> {

  constructor(props) {
    super(props);

    this.state = {
      droppedImages: [],
    };
  }

  clearImagesState() {
    setTimeout(() => {
      this.setState({droppedImages: []});
    }, 2000);
  }

  uploadImages = () => {
    this.props.uploadImages(this.props.id, this.state.droppedImages).catch(err => {
      console.error(err);
      this.clearImagesState();
    });
  }

  onDrop = (acceptedImages) => {
    const droppedImages = [...this.state.droppedImages, ...acceptedImages];
    if (this.props.isCreate) {
      this.setState({droppedImages});
      this.props.addImages(droppedImages);
    } else {
      this.setState({droppedImages});
    }
  }

  handleLoadedImages = (e) => {
    this.clearImagesState();
  }

  render() {
    return (
      <ImageUpload>
        <InputLabel>{this.props.label}</InputLabel>
        <Dropzone
          onDrop={this.onDrop}
          className="dropzone"
          activeClassName="active-dropzone"
          name="images"
          multiple={true}>
          <ImagePreview
            images={this.state.droppedImages}
            isPreview={true}
            isError={this.props.isError}
            progress={this.props.progress}
            isUploaded={this.props.isUploaded}
            isUploading={this.props.isUploading}
          />
          <UploadPlaceholder>{UPLOAD_PLACEHOLDER}</UploadPlaceholder>
          {this.state.droppedImages.length ?
            <Button type="button" onClick={this.uploadImages}>
              <FileUploadIcon />
              {START_UPLOAD}
            </Button> :
            null
          }
        </Dropzone>
        <ImagePreview
          images={this.props.images}
          handleLoadedImages={this.handleLoadedImages}
          isPreview={false}
          isError={false}
          isUploaded={true}
          isUploading={false}
        />
      </ImageUpload>
    );
  }
}

export const mapStateToProps = (state: IAppState) => ({
  progress: state.uploadProgress.progress,
  isUploaded: state.uploadProgress.isUploaded,
  isUploading: state.uploadProgress.isUploading,
  isError: state.uploadProgress.isError,
});

export const FileUpload = connect<{}, {}, any>(mapStateToProps)(FileUploadComponent);
