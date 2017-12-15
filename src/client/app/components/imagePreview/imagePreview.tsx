import * as React from 'react';
import styled from 'styled-components';
import { IImage } from '../../../../shared';

export interface IImagePreview {
  images: IImage[];
  isPreview: boolean;
  removeImage?: (image: IImage) => void;
}

export const ImageWrapper = styled.div`
  img {
    max-height: 120px;
    widht: auto;
    margin: 10px 10px 0 0;
  }
`;

export const ImagePreview = ({images, isPreview}: IImagePreview) => {
  return (
    <ImageWrapper>
      {images.map((image: IImage, index) => {
        const src = isPreview ? image.preview : `http://localhost:3000/${image.path}/${image.fileName}`;
        return (<img src={src} key={index} />);
      })}
    </ImageWrapper>
  );
};
