import * as React from 'react';
import { IImage } from 'global-utils';
import { SortableImage } from './sortableImage';
import DeleteIcon from 'material-ui-icons/Clear';
import Button from 'material-ui/Button';
import { ImageSource, UploadProgress, UploadBar, UploadResult, viewbox } from './style';
import { IUploadProgress } from '../../reducers';
import { SuccessIcon, ErrorIcon } from '../../client-utils';

export interface IImagePreview extends IUploadProgress {
  images: IImage[];
  onLoadImage?: (event) => void;
  onDeleteImage?: (index: number, isTemporary: boolean) => () => void;
  onSortImages?: (images: IImage[]) => void;
}

export const ImagePreview = ({
  images,
  progress,
  isUploaded,
  isUploading,
  hasError,
  onLoadImage,
  onDeleteImage,
  onSortImages,
 }: IImagePreview) => {
  return (
    <div>
      {images.map((image: IImage, index) => {
        const isTemporary = image.hasOwnProperty('preview');
        const src = isTemporary ? image.preview : `http://localhost:3000/${image.path}/${image.thumbName}`;
        return (
          <SortableImage
            isTemporary={isTemporary}
            key={index}
            onSortItems={onSortImages}
            items={images}
            sortId={index}
          >
            <ImageSource>
              <img src={src} onLoad={onLoadImage}/>
              <Button fab color="accent" aria-label="remove" onClick={onDeleteImage(index, isTemporary)}>
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
          </SortableImage>
        );
      })}
    </div>
  );
};
