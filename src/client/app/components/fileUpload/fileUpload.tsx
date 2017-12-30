import * as React from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { ImageUpload, UploadPlaceholder, UploadButtons } from './style';
import { InputLabel } from 'material-ui/Input';
import { ImagePreview, Button } from '../../components';
import { IAppState, IUploadProgress  } from '../../reducers';
import { initialUploadState } from '../../actions';
import { IImage } from 'global-utils';
import { START_UPLOAD, UPLOAD_PLACEHOLDER, CLEAR_IMAGES } from '../../../../data-strings';
import FileUploadIcon from 'material-ui-icons/FileUpload';
import ClearIcon from 'material-ui-icons/Clear';
import Typography from 'material-ui/Typography';

export interface IFileUploadProps extends IUploadProgress {
  label: string;
  isCreate: boolean;
  id: string;
  images: IImage[];
  addImages: (images: any[]) => void;
  uploadImages: (itemId: string, files: any[]) => Promise<any>;
  setInitialUploadState?: () => void;
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

  clearImages = () => {
    this.setState({droppedImages: []});
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
    this.props.setInitialUploadState();
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
          <UploadPlaceholder>
            <Typography type="body1">
              {UPLOAD_PLACEHOLDER}
            </Typography>
          </UploadPlaceholder>
        </Dropzone>
        {this.state.droppedImages.length ?
          <UploadButtons>
            <Button type="button" color="accent" onClick={this.clearImages} style={{margin: '0 2px'}}>
              <ClearIcon />
              {CLEAR_IMAGES}
            </Button>
            <Button type="button" onClick={this.uploadImages} style={{margin: '0 2px'}}>
              <FileUploadIcon />
              {START_UPLOAD}
            </Button>
          </UploadButtons> :
          null
        }
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

export const mapDispatchToProps = (dispatch) => ({
  setInitialUploadState: () => dispatch(initialUploadState),
});

export const mapStateToProps = (state: IAppState) => ({
  progress: state.uploadProgress.progress,
  isUploaded: state.uploadProgress.isUploaded,
  isUploading: state.uploadProgress.isUploading,
  isError: state.uploadProgress.isError,
});

export const FileUpload = connect<{}, {}, any>(mapStateToProps, mapDispatchToProps)(FileUploadComponent);
