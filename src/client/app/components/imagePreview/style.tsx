import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import { UPLOADED_PHOTO_HEIGHT } from 'global-styles';
import { UPLOADED_ANIMATION_DURATION } from 'client-utils/constants';

import { IImagePreview } from './imagePreview';

const isUploadBarHidden = (props: IImagePreview) => props.isUploaded || props.hasError || !props.isUploading;
const showUploadedAnimation = (props: IImagePreview) => props.isUploaded || props.hasError;

export const uploadIconSize = 54;
export const viewbox = `0, 0, ${uploadIconSize}, ${uploadIconSize}`;

const getStyles = (theme: Theme) => ({
  imagePreviewWrapper: (props: IImagePreview) => ({
    padding: props.isTemporary ? '0' : '15px 0',
    '& > label': {
      fontSize: '14px'
    }
  }),
  images: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  image: (props: IImagePreview) => ({
    position: 'relative',
    display: 'inline-block',
    verticalAlign: 'top',
    margin: props.isTemporary ? '0 5px 5px 0' : '15px 10px 5px 0',
    padding: '4px',
    border: '1px solid #dbdbdb',
    background: '#fff',
    boxShadow: '0px 5px 5px -3px #dbdbdb',
    cursor: props.isTemporary ? 'default' : 'move'
  }),
  imageSource: {
    position: 'relative',
    display: 'block',
    height: `${UPLOADED_PHOTO_HEIGHT}px`,
    '&:hover': {
      '& button': {
        visibility: 'visible'
      }
    },
    '& button': {
      visibility: 'hidden',
      position: 'absolute',
      top: '-10px',
      right: '-10px',
      width: '30px',
      height: '30px',
      minHeight: '30px',
      '& svg': {
        width: '18px',
        height: '18px'
      }
    },
    '& img': {
      height: `${UPLOADED_PHOTO_HEIGHT}px`,
      width: 'auto'
    }
  },
  uploadProgress: (props: IImagePreview) => ({
    opacity: isUploadBarHidden(props) ? 0 : 1,
    transition: isUploadBarHidden(props) ? 'none' : 'all 0.2s linear',
    zIndex: 1000,
    pointerEvents: 'none',
    position: 'absolute',
    height: '16px',
    left: '50%',
    top: '50%',
    marginTop: '-8px',
    width: '80px',
    marginLeft: '-40px',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '8px',
    overflow: 'hidden'
  }),
  uploadBar: (props: IImagePreview) => ({
    background: 'linear-gradient(to bottom, #666, #444)',
    position: 'absolute',
    top: '0',
    left: '0',
    bottom: '0',
    transition: 'width 300ms ease-in-out',
    width: `${props.progress}%`
  }),
  '@keyframes passingThrough': {
    '0%': {
      opacity: 0,
      transform: 'translateY(40px)'
    },
    '30%, 70%': {
      opacity: 1,
      transform: 'translateY(0px)'
    },
    '100%': {
      opacity: 0,
      transform: 'translateY(-40px)'
    }
  },
  uploadResult: (props: IImagePreview) => ({
    opacity: 0,
    pointerEvents: 'none',
    zIndex: 500,
    position: 'absolute',
    display: 'block',
    top: '50%',
    left: '50%',
    marginLeft: `-${uploadIconSize / 2}px`,
    marginTop: `-${uploadIconSize / 2}px`,
    // TODO: Fix animation
    animation: showUploadedAnimation(props)
     ? `passingThrough ${UPLOADED_ANIMATION_DURATION / 1000}s cubic-bezier(0.77, 0, 0.175, 1)`
     : 'none',
    '& > svg': {
      width: `${uploadIconSize}px`,
      height: `${uploadIconSize}px`,
      fill: 'rgba(255, 255, 255, .8)'
    }
  })
}) as any;

export const styles = makeStyles(getStyles) as any;
