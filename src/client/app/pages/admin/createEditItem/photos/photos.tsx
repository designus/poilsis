import * as React from 'react';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import Typography from '@material-ui/core/Typography';
import { ImageFile } from 'react-dropzone';

import { IImage, voidFn } from 'global-utils';
import { updatePhotos, uploadPhotos, setInitialUploadState } from 'actions';
import { PhotosForm } from './form';

export interface IPhotoFormState {
  images: IImage[];
  files: ImageFile[];
}

export interface IPhotosFormFields extends IPhotoFormState {
  isUpdateAction?: boolean;
}

class PhotosPageComponent extends React.Component<any, any> {

  constructor(props) {
    super(props);
  }

  onSubmit = (state: IPhotosFormFields) => {
    const itemId = this.props.loadedItem.id;
    if (state.isUpdateAction) {
      this.props.updateImages(itemId, state.images);
    } else {
      this.props.uploadImages(itemId, state.files).then(images => this.props.addImagesToFormState(images));
    }
  }

  render() {
    if (this.props.loadedItem) {
      const images = this.props.loadedItem.images || [];
      const initialValues = { images, files: [] };

      return (
        <div>
          <Typography variant="h5">Photo gallery</Typography>
          <PhotosForm
            onSubmit={this.onSubmit}
            initialValues={initialValues}
            setInitialUploadState={this.props.setInitialUploadState}
          />
        </div>
      );
    } else {
      return null;
    }
  }
}

const mapDispatchToProps = (dispatch) => ({
  uploadImages: (itemId: string, files: ImageFile[]) => dispatch(uploadPhotos(itemId, files)),
  updateImages: (itemId: string, images: IImage[]) => dispatch(updatePhotos(itemId, images)),
  setInitialUploadState: () => dispatch(setInitialUploadState()),
  addImagesToFormState: (images: IImage[]) => dispatch(change('PhotosForm', 'images', images)),
});

export const PhotosPage = connect(voidFn, mapDispatchToProps)(PhotosPageComponent);
