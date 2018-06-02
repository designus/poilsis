import * as React from 'react';
import { SortableImage } from './sortableImage';
import DeleteIcon from 'material-ui-icons/Clear';
import Button from 'material-ui/Button';
import { InputLabel } from 'material-ui/Input';
import { ImageSource, UploadProgress, UploadBar, UploadResult, viewbox, Image, Images, ImagePreviewWrapper } from './style';
import { IUploadProgress } from '../../reducers';
import { SuccessIcon, ErrorIcon } from '../../client-utils';
import { IImage } from '../../../../global-utils';

export interface IImagePreview extends IUploadProgress {
  isTemporary: boolean;
  images: IImage[];
  label?: string;
  onLoadImage?: (event) => void;
  onDeleteImage?: (index: number, isTemporary: boolean) => (e: any) => void;
  onSortImages?: (images: IImage[]) => void;
}

export const ImagePreview = ({
  images,
  label,
  progress,
  isUploaded,
  isUploading,
  isTemporary,
  hasError,
  onLoadImage,
  onDeleteImage,
  onSortImages,
 }: IImagePreview) => {
  return (
    <ImagePreviewWrapper isTemporary={isTemporary}>
      <InputLabel>{label}</InputLabel>
      <Images>
        {images.map((image: IImage, index) => {
          const key = image.id || 'img' + index;
          const src = isTemporary ? image.preview : `http://localhost:3000/${image.path}/${image.thumbName}`;
          const ImgWrapper = isTemporary ? Image : SortableImage;

          return (
            <ImgWrapper
              isTemporary={isTemporary}
              key={key}
              onSortItems={onSortImages}
              items={images}
              sortId={index}
            >
              <ImageSource>
                <img src={src} onLoad={onLoadImage} draggable={!isTemporary} />
                <Button fab color="secondary" aria-label="remove" onClick={onDeleteImage(index, isTemporary)}>
                  <DeleteIcon />
                </Button>
              </ImageSource>
              <UploadProgress
                isUploaded={isUploaded}
                hasError={hasError}
                isUploading={isUploading}
              >
                <UploadBar progress={progress} />
              </UploadProgress>
              <UploadResult
                isUploaded={isUploaded}
                hasError={hasError}
                showLoader={isTemporary}
              >
                {hasError ?
                  <ErrorIcon viewBox={viewbox} /> :
                  <SuccessIcon viewBox={viewbox} />
                }              
              </UploadResult>
            </ImgWrapper>
          );
        })}
      </Images>
    </ImagePreviewWrapper>
  );
};
