import * as React from 'react';
import { connect } from 'react-redux';
import { uploadImages } from '../../../../actions';
import { extendWithForm } from '../../../../components';
import {
  getFormStateWithData,
  getInitialFormState,
  // getBackendErrors,
  voidFn,
  TGenericFormModel,
  getKeyMap,
  maxLength,
} from '../../../../client-utils';
import { Form } from './form';
import { CREATE_EDIT_ITEM_LOADER } from '../createEditItem';
import { IMAGES_LABEL, ID_LABEL } from '../../../../../../data-strings';
import { IImage } from 'global-utils';

export interface IPhotoFields {
  id?: string;
  images?: IImage[];
  files?: any[];
}

export type TPhotosModel = TGenericFormModel<IPhotoFields>;

export const photosModel: TPhotosModel = {
  id: getKeyMap('', ID_LABEL, []),
  images: getKeyMap([], IMAGES_LABEL, [maxLength(6, true)]),
  files: getKeyMap([], 'files', []),
};

const PhotosForm = extendWithForm(Form);

class PhotosPageComponent extends React.Component<any, any> {

  state = getInitialFormState(photosModel);
  isCreatePage = !Boolean(this.props.params.id);

  constructor(props) {
    super(props);
  }

  onItemSubmit = (item) => {
    if (this.isCreatePage) {
      this.setState(getInitialFormState(photosModel));
    } else {
      // this.props.putItem(item).catch((errors) => {
      //   const newErrors = {...this.state.errors, ...getBackendErrors(errors)};
      //   this.setState({errors: newErrors, showErrors: true});
      // });
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
    uploadImages: (itemId, files) => dispatch(uploadImages(itemId, files)),
  };
};

export const PhotosPage = connect(voidFn, mapDispatchToProps)(PhotosPageComponent);
