import styled from 'styled-components';
import {UPLOADED_PHOTO_HEIGHT, DIVIDER_COLOR} from '../../global-styles';

export const ImageUpload = styled.div`
  margin: 10px 0;

  label {
    font-size: 13px;
  }

  .dropzone {
    padding: 15px 0;
    margin: 10px 0;
    border: 2px dashed ${DIVIDER_COLOR};
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
