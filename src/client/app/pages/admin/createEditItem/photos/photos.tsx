import * as React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { IImage, IPhotoFormState } from 'global-utils/typings';
import { IAppState, ThunkDispatch } from 'types';

import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { updatePhotos, uploadPhotos, receiveImages } from 'actions/items';
import { resetUploadState } from 'actions/upload';
import { extendWithLoader } from 'components/extendWithLoader';
import { PhotosForm } from './form';

import { IOwnProps, IDispatchProps, Props } from './types';

const PhotosFormWithLoader = extendWithLoader(PhotosForm);

class PhotosPage extends React.Component<Props> {
  getItemId = () => this.props.loadedItem.id;

  handleImagesUpload = (state: IPhotoFormState) => {
    if (state.files) {
      this.props.uploadImages(this.getItemId(), state.files);
    }
  }

  handleImagesUpdate = (images: IImage[]) => {
    this.props.updateImages(this.getItemId(), images);
  }

  render() {
    return this.props.loadedItem ? (
      <React.Fragment>
        <PhotosFormWithLoader
          onSubmit={this.handleImagesUpload}
          onSaveImages={this.handleImagesUpdate}
          onSortImages={this.props.sortImages(this.props.loadedItem.id)}
          onResetUploadState={this.props.resetUploadState}
          loaderId={CONTENT_LOADER_ID}
          intl={this.props.intl}
          showLoadingOverlay={true}
          initialValues={{files: []}}
          images={this.props.loadedItem.images}
        />
      </React.Fragment>
    ) : null;
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch): IDispatchProps => ({
  uploadImages: (itemId, files) => dispatch(uploadPhotos(itemId, files)),
  updateImages: (itemId, images) => dispatch(updatePhotos(itemId, images)),
  resetUploadState: () => dispatch(resetUploadState()),
  sortImages: id => (images: IImage[]) => dispatch(receiveImages(id, images, null))
});

export default injectIntl(
  connect<{}, IDispatchProps, IOwnProps, IAppState>(undefined, mapDispatchToProps)(PhotosPage)
);
