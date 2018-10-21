import styled from 'styled-components';
import { UPLOADED_PHOTO_HEIGHT } from 'global-styles';

export const ImageUpload = styled.div`
  margin: 10px 0;

  .dropzone {
    padding: 15px;
    margin: 20px 0 10px;
    border: 2px dashed #dbdbdb;
    background: #efefef;
    text-align: center;
    cursor: pointer;
    min-height: ${UPLOADED_PHOTO_HEIGHT}px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

`;

export const UploadPlaceholder = styled.div`
  width: 100%;
  margin: 10px 0;
`;

export const UploadButtons = styled.div`
  margin: 10px 0;
`;
