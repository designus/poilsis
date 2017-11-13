import * as React from 'react';
import Dropzone from 'react-dropzone';
import uniqBy from 'lodash-es/uniqBy';
import { IImage } from 'helpers';
import { ImageUpload } from './style';
import { InputLabel } from 'material-ui/Input';
import { ImagePreview } from './imagePreview';

export interface IFileUploadProps {
  images: IImage[];
  label: string;
  id: string;
  addImages: (images: any[]) => void;
  removeImage: (image: IImage) => void;
};

export class FileUpload extends React.Component<IFileUploadProps, any> {

  constructor(props) {
    super(props);

    this.state = {
      images: [],
    };
  }

  onDrop = (acceptedImages) => {
    const images = uniqBy([...this.state.images, ...acceptedImages], 'name');
    this.props.addImages(images);
    this.setState({images});
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
        </Dropzone>
        <ImagePreview
          images={this.state.images}
        />
      </ImageUpload>
    );
  }
}
