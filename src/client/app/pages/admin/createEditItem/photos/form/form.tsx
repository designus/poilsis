import * as React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { Dispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { isEqual } from 'lodash';
import { FormattedMessage, InjectedIntl } from 'react-intl';

import { maxUploadedPhotos, maxUploadedPhotoSize, asyncValidateImage, IImage, IPhotoFormState, itemValidation } from 'global-utils';

import { adminRoutes } from 'client-utils/routes';
import { Button } from 'components/button';
import { DropzoneInput } from 'components/formFields/dropzoneInput';
import { ImagePreview } from 'components/imagePreview';
import { ItemPageMatchParams } from '../../createEditItem';

interface ICustomProps extends RouteComponentProps<ItemPageMatchParams> {
  images: IImage[];
  onResetUploadState: () => void;
  onSaveImages: (images: IImage[]) => void;
  onSortImages: (images: IImage[]) => void;
  intl: InjectedIntl;
}

type FormProps = ICustomProps & InjectedFormProps<{}, ICustomProps>;

export const PHOTOS_FORM_NAME = 'PhotosForm';

const { images: { maxPhotos } } = itemValidation;

const validators = [
  maxUploadedPhotos,
  maxUploadedPhotoSize
];

let loadedImages = 0;

function FormComponent(props: FormProps) {
  const { useState, useEffect } = React;
  const { images: initialImages, onSaveImages, intl: { formatMessage } } = props;
  const [images, setImages] = useState([...initialImages]);

  useEffect(() => {
    setImages([...initialImages]);
  }, [initialImages]);

  const handleImageDelete = (index: number) => (e: React.FormEvent<HTMLInputElement>) => {
    e.stopPropagation();
    images.splice(index, 1);
    setImages([...images]);
    loadedImages--;
  };

  const handleImagesSave = () => {
    onSaveImages(images);
  };

  const handleImagesSort = (images: IImage[]) => {
    setImages([...images]);
  };

  const clearDroppedImages = () => {
    props.change('files', []);
  };

  const handleImageLoad = () => {
    loadedImages++;
    if (loadedImages === images.length) {
      props.onResetUploadState();
      clearDroppedImages();
    }
  };

  const getImagePreviewLabel = () =>
    formatMessage({id: 'admin.file_upload.image_preview_label'}, {
      uploadedCount: images.length,
      totalCount: maxPhotos
    });

  const isSubmitDisabled = () => {
    const imagesIds = images.map((image: IImage) => image.id);
    const initialImagesIds = initialImages.map((image: IImage) => image.id);
    return isEqual(imagesIds, initialImagesIds);
  };

  const handleBackClick = () => props.history.push(adminRoutes.items.getLink());

  return (
    <form autoComplete="off">
      <Field
        name="files"
        component={DropzoneInput}
        validate={validators}
        clearDroppedImages={clearDroppedImages}
        formName="PhotosForm"
      />
      <ImagePreview
        label={getImagePreviewLabel()}
        images={images}
        onLoadImage={handleImageLoad}
        onDeleteImage={handleImageDelete}
        onSortImages={handleImagesSort}
        hasError={false}
        isUploaded={true}
        isUploading={false}
        isTemporary={false}
      />
      <div>
        <Button onClick={handleBackClick} type="button" variant="outlined" color="default">
          <FormattedMessage id="common.cancel" />
        </Button>
        <Button
          onClick={handleImagesSave}
          disabled={isSubmitDisabled()}
        >
          <FormattedMessage id="common.save" />
        </Button>
      </div>
    </form>
  );
}

export default withRouter(
  reduxForm<{}, ICustomProps>({
    form: PHOTOS_FORM_NAME,
    asyncValidate: (item: IPhotoFormState, dispatch: Dispatch<any>, props) => asyncValidateImage(item, props.intl),
    enableReinitialize: true
  })(FormComponent)
);
