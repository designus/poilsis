import * as React from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { ImageUpload } from './style';
import { InputLabel } from 'material-ui/Input';
import { ImagePreview } from '../imagePreview';
import { IAppState, IUploadProgress  } from '../../reducers';
import { IImage } from 'global-utils';

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

  uploadImages(droppedImages) {
    this.props.uploadImages(this.props.id, droppedImages).catch(err => {
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
      this.uploadImages(droppedImages);
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
          <div>Drag and drop or click to select a 550x550px file to upload.</div>
          <ImagePreview
            images={this.state.droppedImages}
            isPreview={true}
            isError={this.props.isError}
            progress={this.props.progress}
            isUploaded={this.props.isUploaded}
          />
        </Dropzone>
        <ImagePreview
          images={this.props.images}
          handleLoadedImages={this.handleLoadedImages}
          isPreview={false}
          isError={false}
          isUploaded={true}
        />
      </ImageUpload>
    );
  }
}

export const mapStateToProps = (state: IAppState) => ({
  progress: state.uploadProgress.progress,
  isUploaded: state.uploadProgress.isUploaded,
  isError: state.uploadProgress.isError,
});

export const FileUpload = connect<{}, {}, any>(mapStateToProps)(FileUploadComponent);
