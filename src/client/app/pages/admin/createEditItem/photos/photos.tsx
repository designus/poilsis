import * as React from 'react';
import { connect } from 'react-redux';
import { change, isDirty, isSubmitting } from 'redux-form';
import Typography from '@material-ui/core/Typography';
import { ImageFile } from 'react-dropzone';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';

import { IImage } from 'global-utils';
import { CONTENT_LOADER_ID } from 'client-utils';
import { updatePhotos, uploadPhotos, setInitialUploadState } from 'actions';
import { extendWithLoader } from 'components';
import { PhotosForm, PHOTOS_FORM_NAME } from './form';

const PhotosFormWithLoader = extendWithLoader(PhotosForm);

export interface IPhotoFormState {
  images: IImage[];
  files: ImageFile[];
}

export interface IPhotosFormFields extends IPhotoFormState, InjectedIntlProps {
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
          <Typography variant="h5">
            <FormattedMessage id="admin.menu.photo_gallery" />
          </Typography>
          <PhotosFormWithLoader
            onSubmit={this.onSubmit}
            loaderId={CONTENT_LOADER_ID}
            formatMessage={this.props.intl.formatMessage}
            showLoadingOverlay={true}
            initialValues={initialValues}
            isDirty={this.props.isDirty}
            setInitialUploadState={this.props.setInitialUploadState}
          />
        </div>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => ({
  isDirty: isDirty(PHOTOS_FORM_NAME)(state) && !isSubmitting(PHOTOS_FORM_NAME)(state),
});

const mapDispatchToProps = (dispatch) => ({
  uploadImages: (itemId: string, files: ImageFile[]) => dispatch(uploadPhotos(itemId, files)),
  updateImages: (itemId: string, images: IImage[]) => dispatch(updatePhotos(itemId, images)),
  setInitialUploadState: () => dispatch(setInitialUploadState()),
  addImagesToFormState: (images: IImage[]) => dispatch(change('PhotosForm', 'images', images)),
});

export const PhotosPage = injectIntl(
  connect<any, any, IPhotosFormFields>(mapStateToProps, mapDispatchToProps)(PhotosPageComponent),
);
