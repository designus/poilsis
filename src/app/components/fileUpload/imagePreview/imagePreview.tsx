import * as React from 'react';
import styled from 'styled-components';

export const ImageWrapper = styled.div`
  img {
    max-height: 100px;
    widht: auto;
    margin: 10px 10px 0 0;
  }
`;

export const ImagePreview = ({images}) => {
  return (
    <ImageWrapper>
      {images.map((image, index) => {
        return <img key={index} src={image.preview} />;
      })}
    </ImageWrapper>
  );
};
