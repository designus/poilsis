import * as React from 'react';
import Dropzone from 'react-dropzone';
import { ImageUpload } from './style';
import { InputLabel } from 'material-ui/Input';
import { ImagePreview } from '../imagePreview';

export interface IFileUploadProps {
  label: string;
  isCreate: boolean;
  id: string;
  addImages: (images: any[]) => void;
  uploadImages: (itemId: string, files: any[]) => Promise<any>;
};

export class FileUpload extends React.Component<IFileUploadProps, any> {

  constructor(props) {
    super(props);

    this.state = {
      droppedImages: [],
    };
  }

  onDrop = (acceptedImages) => {
    const droppedImages = [...this.state.droppedImages, ...acceptedImages];
    if (this.props.isCreate) {
      this.setState({droppedImages});
      this.props.addImages(droppedImages);
    } else {
      this.props.uploadImages(this.props.id, droppedImages).then(err => {
        if (!err) {
          this.setState({droppedImages: []});
        }
      });
    }
  }

  render() {
    return (
      <ImageUpload>
        <InputLabel>{this.props.label}</InputLabel>
        <Dropzone
          onDrop={this.onDrop}
          className="dropzone"
          activeClassName="active-dropzone"
          accept="image/jpeg,image/jpg,image/png"
          name="images"
          multiple={true}>
          <div>Drag and drop or click to select a 550x550px file to upload.</div>
          <ImagePreview
            images={this.state.droppedImages}
            isPreview={true}
          />
        </Dropzone>
      </ImageUpload>
    );
  }
}
