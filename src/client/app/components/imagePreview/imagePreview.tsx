import * as React from 'react';
import { IImage } from 'global-utils';

import { ImagesWrapper, Image, ImageSource, UploadProgress, UploadBar, UploadResult, viewbox } from './style';
import { IUploadProgress } from '../../reducers';
import { SuccessIcon, ErrorIcon } from '../../client-utils';

export interface IImagePreview extends IUploadProgress {
  images: IImage[];
  isPreview: boolean;
  removeImage?: (image: IImage) => void;
  handleLoadedImages?: any;
}

export const ImagePreview = ({images, isPreview, progress, isUploaded, isError, handleLoadedImages}: IImagePreview) => {
  return (
    <ImagesWrapper>
      {images.map((image: IImage, index) => {
        const src = isPreview ? image.preview : `http://localhost:3000/${image.path}/${image.fileName}`;
        return (
          <Image key={index}>
            <ImageSource>
              <img src={src} onLoad={handleLoadedImages}/>
            </ImageSource>
            <UploadProgress isUploaded={isUploaded} isError={isError}>
              <UploadBar progress={progress} />
            </UploadProgress>
            <UploadResult isUploaded={isUploaded} isError={isError} showLoader={isPreview}>
              {isError ? <ErrorIcon viewBox={viewbox} /> : <SuccessIcon viewBox={viewbox} />}              
            </UploadResult>
          </Image>
        );
      })}
    </ImagesWrapper>
  );
};
