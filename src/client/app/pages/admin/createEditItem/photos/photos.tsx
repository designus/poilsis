import * as React from 'react';
import { connect } from 'react-redux';
import { updatePhotos, uploadPhotos, setInitialUploadState } from 'actions';
import { voidFn } from 'client-utils';
import { IImage } from 'global-utils';
import Typography from '@material-ui/core/Typography';
import { change } from 'redux-form';
import { PhotosForm } from './form';

export interface IPhotosFormFields {
  images: IImage[];
  files: File[];
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
          <Typography variant="headline">Photo gallery</Typography>
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

const mapDispatchToProps = (dispatch) => {
  return {
    uploadImages: (itemId, files) => dispatch(uploadPhotos(itemId, files)),
    updateImages: (itemId: string, images: IImage[]) => dispatch(updatePhotos(itemId, images)),
    setInitialUploadState: () => dispatch(setInitialUploadState()),
    addImagesToFormState: (images) => dispatch(change('PhotosForm', 'images', images)),
  };
};

export const PhotosPage = connect(voidFn, mapDispatchToProps)(PhotosPageComponent);
