import * as React from 'react';
import { IImage } from 'global-utils';
import { ImagesWrapper, Image, ImageSource, UploadProgress, UploadBar } from './style';
import { IUploadProgress } from '../../reducers';

export interface IImagePreview extends IUploadProgress {
  images: IImage[];
  isPreview: boolean;
  removeImage?: (image: IImage) => void;
  handleLoadedImages?: any;
}

export const ImagePreview = ({images, isPreview, progress, isUploaded, handleLoadedImages}: IImagePreview) => {
  return (
    <ImagesWrapper>
      {images.map((image: IImage, index) => {
        const src = isPreview ? image.preview : `http://localhost:3000/${image.path}/${image.fileName}`;
        return (
          <Image key={index}>
            <ImageSource>
              <img src={src} onLoad={handleLoadedImages}/>
            </ImageSource>
            <UploadProgress isUploaded={isUploaded}>
              <UploadBar progress={progress} />
            </UploadProgress>
          </Image>
        );
      })}
    </ImagesWrapper>
  );
};
