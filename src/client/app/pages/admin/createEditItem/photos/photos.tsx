import * as React from 'react';
import { connect } from 'react-redux';
import { uploadPhotos, updatePhotos } from '../../../../actions';
import { extendWithForm } from '../../../../components';
import {
  getFormStateWithData,
  getInitialFormState,
  // getBackendErrors,
  voidFn,
  TGenericFormModel,
  IGenericFormState,
  getKeyMap,
  maxLength,
} from '../../../../client-utils';
import { Form } from './form';
import { CREATE_EDIT_ITEM_LOADER } from '../createEditItem';
import { IMAGES_LABEL, ID_LABEL, FILES_KEY } from '../../../../../../data-strings';
import { IImage } from 'global-utils';

export interface IImageFields {
  id?: string;
  images?: IImage[];
  files?: any[];
}

export type TPhotosModel = TGenericFormModel<IImageFields>;

export const photosModel: TPhotosModel = {
  id: getKeyMap('', ID_LABEL, []),
  images: getKeyMap([], IMAGES_LABEL, [maxLength(6, true)]),
  files: getKeyMap([], FILES_KEY, []),
};

const PhotosForm = extendWithForm(Form);

class PhotosPageComponent extends React.Component<any, any> {

  state: IGenericFormState<IImageFields> = getInitialFormState(photosModel);
  isCreatePage = !Boolean(this.props.params.id);

  constructor(props) {
    super(props);
  }

  onItemSubmit = (item: IImageFields) => {
    if (this.isCreatePage) {
      this.setState(getInitialFormState(photosModel));
    } else {
      this.props.updateImages(item.id, item.images, CREATE_EDIT_ITEM_LOADER);
    }
  }

  render() {

    const finalState = this.props.loadedItem && getFormStateWithData(this.props.loadedItem, this.state) || this.state;

    if (this.props.loadedItem || this.isCreatePage) {

      return (
        <PhotosForm
          loaderId={CREATE_EDIT_ITEM_LOADER}
          onItemSubmit={this.onItemSubmit}
          initialState={finalState}
          citiesMap={this.props.citiesMap}
          typesMap={this.props.typesMap}
          uploadImages={this.props.uploadImages}
          isCreate={this.isCreatePage}
        />
      );
    } else {
      return null;
    }
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    uploadImages: (itemId, files) => dispatch(uploadPhotos(itemId, files)),
    updateImages: (itemId: string, images: IImage[], loaderId: string) => dispatch(updatePhotos(itemId, images, loaderId)),
  };
};

export const PhotosPage = connect(voidFn, mapDispatchToProps)(PhotosPageComponent);
