import * as React from 'react';
import DeleteIcon from '@material-ui/icons/Clear';
import Fab from '@material-ui/core/Fab';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';

import { IUploadProgressState } from 'types';
import { SuccessIcon, ErrorIcon } from 'client-utils/custom-icons';
import { Image } from 'global-utils/data-models';
import { config } from 'config';
import { ImageWrapper } from './imageWrapper';

import { styles, viewbox } from './style';

export interface IImagePreview extends IUploadProgressState, WithStyles<typeof styles> {
  isTemporary: boolean;
  images: Image[];
  label?: string;
  onLoadImage?: () => void;
  onDeleteImage: (index: number) => (e: any) => void;
  onSortImages?: (images: Image[]) => void;
  showLoader?: boolean;
}

const ImagePreview = (props: IImagePreview) => {
  const {
    label,
    images,
    hasError,
    onDeleteImage,
    onLoadImage,
    isTemporary,
    onSortImages,
    classes
  } = props;

  const renderUploadProgress = () => {
    return (
      <div className={classes.uploadProgress}>
        <div className={classes.uploadBar} />
      </div>
    );
  };

  const renderUploadResult = () => {
    return (
      <div className={classes.uploadResult}>
        {hasError
          ? <ErrorIcon viewBox={viewbox} />
          : <SuccessIcon viewBox={viewbox} />
        }
      </div>
    );
  };

  const renderImage = (image: Image, index: number) => {
    const src = isTemporary ? image.preview : `${config.host}/${image.path}/${image.thumbName}`;
    return (
      <div className={classes.imageSource}>
        <img src={src} onLoad={onLoadImage} draggable={!isTemporary} />
        <Fab color="secondary" aria-label="remove" onClick={onDeleteImage(index)}>
          <DeleteIcon />
        </Fab>
      </div>
    );
  };

  const renderImageWrapper = (image: Image, index: number, array: Image[]) => {
    const key = image.id ? image.id : index;
    return (
      <ImageWrapper
        isTemporary={isTemporary}
        key={key}
        onSortItems={onSortImages}
        items={array}
        sortId={index}
        classes={classes}
      >
        {renderImage(image, index)}
        {renderUploadProgress()}
        {renderUploadResult()}
      </ImageWrapper>
    );
  };

  return (
    <div className={classes.imagePreviewWrapper}>
      <InputLabel>{label}</InputLabel>
      {images ? (
        <div className={classes.images}>
          {images.map(renderImageWrapper)}
        </div>
      ) : null}
    </div>
  );
};

export default withStyles(styles)(ImagePreview);
