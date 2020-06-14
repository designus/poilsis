import * as React from 'react';
import { Field, reduxForm } from 'redux-form';
import { isEqual } from 'lodash';

import { maxUploadedPhotos, maxUploadedPhotoSize, asyncValidateImage, IPhotoFormState, itemValidation } from 'global-utils';
import { Image } from 'global-utils/data-models';
import { adminRoutes } from 'client-utils/routes';
import { DropzoneInput } from 'components/formFields/dropzoneInput';
import { ImagePreview } from 'components/imagePreview';
import { AdminFormActions } from 'components/adminFormActions';
import { ICustomProps, Props } from './types';

export const PHOTOS_FORM_NAME = 'PhotosForm';

const { images: { maxPhotos } } = itemValidation;

const validators = [
  maxUploadedPhotos,
  maxUploadedPhotoSize
];

let loadedImages = 0;

function FormComponent(props: Props) {
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

  const handleImagesSort = (images: Image[]) => {
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
    const imagesIds = images.map((image: Image) => image.id);
    const initialImagesIds = initialImages.map((image: Image) => image.id);
    return isEqual(imagesIds, initialImagesIds);
  };

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
      <AdminFormActions
        backLink={adminRoutes.items.getLink()}
        isSubmitDisabled={isSubmitDisabled()}
        onSubmit={handleImagesSave}
      />
    </form>
  );
}

export default reduxForm<{}, ICustomProps>({
  form: PHOTOS_FORM_NAME,
  asyncValidate: (item: IPhotoFormState, dispatch, props) => asyncValidateImage(item, props.intl),
  enableReinitialize: true
})(FormComponent);
