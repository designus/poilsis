import styled, {keyframes} from 'styled-components';
import {UPLOADED_PHOTO_HEIGHT} from '../../global-styles';

const isUploadBarHidden = (props: any) => props.isUploaded || props.isError || !props.isUploading;
export const uploadIconSize = 54;
export const viewbox = `0, 0, ${uploadIconSize}, ${uploadIconSize}`;

export const ImagesWrapper = styled.div`
`;

export const Image = styled.div`
  position: relative;
  display: inline-block;
  vertical-align: top;
  margin: 0 5px;
  max-height: ${UPLOADED_PHOTO_HEIGHT}px;
`;

export const ImageSource = styled.div`
  overflow: hidden;
  position: relative;
  display: block;
  z-index: 10;
  height: ${UPLOADED_PHOTO_HEIGHT}px;

  img {
    height: ${UPLOADED_PHOTO_HEIGHT}px;
    width: auto;
  }
`;

export const UploadProgress = styled.div`
  opacity: ${(props: any) => isUploadBarHidden(props) ? 0 : 1};
  transition: ${(props: any) => isUploadBarHidden(props) ? 'none' : 'all 0.2s linear' };
  z-index: 1000;
  pointer-events: none;
  position: absolute;
  height: 16px;
  left: 50%;
  top: 50%;
  margin-top: -8px;
  width: 80px;
  margin-left: -40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  overflow: hidden;
` as any;

export const UploadBar = styled.span`
  background: linear-gradient(to bottom, #666, #444);
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  transition: width 300ms ease-in-out;
  width: ${(props: any) => props.progress + '%'}
` as any;

export const passingThrough = keyframes`
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  30%, 70% {
    opacity: 1;
    transform: translateY(0px);
  }
  100% {
    opacity: 0;
    transform: translateY(-40px);
  }
`;

export const UploadResult = styled.div`
  opacity: 0;
  pointer-events: none;
  z-index: 500;
  position: absolute;
  display: block;
  top: 50%;
  left: 50%;
  margin-left: -${uploadIconSize / 2}px;
  margin-top: -${uploadIconSize / 2}px;
  animation: ${(props: any) =>
    (props.isUploaded || props.isError) && props.showLoader ? `${passingThrough} 2s cubic-bezier(0.77, 0, 0.175, 1) 0.2s` : 'none'};
  & > svg {
    width: ${uploadIconSize}px;
    height: ${uploadIconSize}px;
    fill: rgba(255, 255, 255, .8)
  }
` as any;
