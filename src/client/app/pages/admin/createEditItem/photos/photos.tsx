import * as React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';

import { IImage, IPhotoFormState } from 'global-utils';
import { CONTENT_LOADER_ID } from 'client-utils';
import { updatePhotos, uploadPhotos, resetUploadState, receiveImages } from 'actions';
import { extendWithLoader } from 'components';
import { PhotosForm } from './form';

const PhotosFormWithLoader = extendWithLoader(PhotosForm);

interface IPhotosFormFields extends IPhotoFormState, InjectedIntlProps {}

class PhotosPage extends React.Component<any, any> {

  constructor(props) {
    super(props);
  }

  getItemId = () => this.props.loadedItem.id;

  handleImagesUpload = (state: IPhotoFormState) => {
    this.props.uploadImages(this.getItemId(), state.files);
  }

  handleImagesUpdate = (images: IImage[]) => {
    this.props.updateImages(this.getItemId(), images);
  }

  render() {
    return this.props.loadedItem ? (
      <React.Fragment>
        <Typography variant="h5">
          <FormattedMessage id="admin.menu.photo_gallery" />
        </Typography>
        <PhotosFormWithLoader
          onSubmit={this.handleImagesUpload}
          onSaveImages={this.handleImagesUpdate}
          onSortImages={this.props.sortImages(this.props.loadedItem.id)}
          onResetUploadState={this.props.resetUploadState}
          loaderId={CONTENT_LOADER_ID}
          formatMessage={this.props.intl.formatMessage}
          showLoadingOverlay={true}
          initialValues={{files: []}}
          images={this.props.loadedItem.images}
        />
      </React.Fragment>
    ) : null;
  }
}

const mapDispatchToProps = (dispatch) => ({
  uploadImages: (itemId: string, files: File[]) => dispatch(uploadPhotos(itemId, files)),
  updateImages: (itemId: string, images: IImage[]) => dispatch(updatePhotos(itemId, images)),
  resetUploadState: () => dispatch(resetUploadState()),
  sortImages: (id: string) => (images: IImage[]) => dispatch(receiveImages(id, images)),
});

export default injectIntl(
  connect<any, any, IPhotosFormFields>(undefined, mapDispatchToProps)(PhotosPage),
);
