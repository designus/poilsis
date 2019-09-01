import * as React from 'react';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import { isEqual } from 'lodash';

import { Button } from 'components/button';
import { IImage, itemValidation } from 'global-utils';
import { IUploadProgressState } from 'types';

import { ImagePreview } from 'components/imagePreview';
import { styles } from './styles';

const { images: { maxPhotos } } = itemValidation;

export interface IUploadedImagesParams extends
  WithStyles<typeof styles>,
  IUploadProgressState,
  InjectedIntlProps  {
    images: IImage[];
    onSortImages: (images: IImage[]) => void;
    onLoadedImages: () => void;
    onSaveImages: (images: IImage[]) => void;
}

let loadedImages = 0;

function UploadedImages(props: IUploadedImagesParams) {
  const { useState, useEffect } = React;
  const { images: initialImages, onSaveImages, onLoadedImages, intl: { formatMessage } } = props;
  console.log('Images', initialImages);
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

  const handleImageLoad = () => {
    loadedImages++;
    if (loadedImages === images.length && onLoadedImages) {
      onLoadedImages();
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

  return (
    <React.Fragment>
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
      <Button
        onClick={handleImagesSave}
        disabled={isSubmitDisabled()}
      >
        <FormattedMessage id="common.save" />
      </Button>
    </React.Fragment>
  );

}

export default injectIntl(withStyles(styles)(UploadedImages));
