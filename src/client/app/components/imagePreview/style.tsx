import styled from 'styled-components';

export const ImagesWrapper = styled.div`
  margin: 10px 0;
`;

export const Image = styled.div`
  position: relative;
  display: inline-block;
  vertical-align: top;
  margin: 15px 10px 15px 0;
  max-height: 120px;
`;

export const ImageSource = styled.div`
  overflow: hidden;
  position: relative;
  display: block;
  z-index: 10;
  height: 120px;

  img {
    height: 120px;
    width: auto;
  }
`;

export const UploadProgress = styled.div`
  opacity: ${(props: any) => props.isUploaded ? 0 : 1};
  transition: ${(props: any) => props.isUploaded ? 'none' : 'all 0.2s linear' };
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
