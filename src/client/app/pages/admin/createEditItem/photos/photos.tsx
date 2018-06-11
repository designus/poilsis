import * as React from 'react';
import { connect } from 'react-redux';
import { updatePhotos } from '../../../../actions';
import { extendWithForm } from '../../../../components';
import {
  getFormStateWithData,
  getInitialFormState,
  voidFn,
  TGenericFormModel,
  CONTENT_LOADER_ID,
  IGenericFormState,
  getKeyMap,
  maxLength,
} from '../../../../client-utils';
import { Form } from './form';
import { IMAGES_LABEL, ID_LABEL, FILES_KEY, PHOTO_GALLERY } from '../../../../../../data-strings';
import { IImage, MAX_FILE_COUNT } from '../../../../../../global-utils';
import Typography from '@material-ui/core/Typography';

export interface IImageFields {
  id?: string;
  images?: IImage[];
  files?: any[];
}

export type TPhotosModel = TGenericFormModel<IImageFields>;

export const photosModel: TPhotosModel = {
  id: getKeyMap('', ID_LABEL, []),
  images: getKeyMap([], IMAGES_LABEL, [maxLength(MAX_FILE_COUNT, true)]),
  files: getKeyMap([], FILES_KEY, []),
};

const PhotosForm = extendWithForm(Form);

class PhotosPageComponent extends React.Component<any, any> {

  state: IGenericFormState<IImageFields> = getInitialFormState(photosModel);
  isCreatePage = !Boolean(this.props.match.params.id);

  constructor(props) {
    super(props);
  }

  onItemSubmit = (item: IImageFields) => {
    if (this.isCreatePage) {
      this.setState(getInitialFormState(photosModel));
    } else {
      this.props.updateImages(item.id, item.images);
    }
  }

  render() {
    const finalState = this.props.loadedItem && getFormStateWithData(this.props.loadedItem, this.state) || this.state;

    if (this.props.loadedItem || this.isCreatePage) {

      return (
        <div>
          <Typography variant="headline">{PHOTO_GALLERY}</Typography>
          <PhotosForm
            loaderId={CONTENT_LOADER_ID}
            onItemSubmit={this.onItemSubmit}
            initialState={finalState}
            citiesMap={this.props.citiesMap}
            typesMap={this.props.typesMap}
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
    updateImages: (itemId: string, images: IImage[], loaderId: string) => dispatch(updatePhotos(itemId, images)),
  };
};

export const PhotosPage = connect(voidFn, mapDispatchToProps)(PhotosPageComponent);
