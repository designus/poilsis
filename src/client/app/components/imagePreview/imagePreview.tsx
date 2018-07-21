import * as React from 'react';
import { SortableImage } from './sortableImage';
import DeleteIcon from '@material-ui/icons/Clear';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import { IUploadProgress } from 'reducers';
import { SuccessIcon, ErrorIcon } from 'client-utils';
import { IImage } from 'global-utils';
import { ImageSource, UploadProgress, UploadBar, UploadResult, viewbox, Image, Images, ImagePreviewWrapper } from './style';

export interface IImagePreview extends IUploadProgress {
  isTemporary: boolean;
  images: IImage[];
  label?: string;
  onLoadImage?: () => void;
  onDeleteImage?: (index: number) => (e: any) => void;
  onSortImages?: (images: IImage[]) => void;
}

export class ImagePreview extends React.Component<IImagePreview> {

  renderUploadProgress = () => {
    const { isUploaded, hasError, isUploading, progress } = this.props;
    return (
      <UploadProgress
        isUploaded={isUploaded}
        hasError={hasError}
        isUploading={isUploading}
      >
        <UploadBar progress={progress} />
      </UploadProgress>
    );
  }

  renderUploadResult = () => {
    const { isUploaded, hasError, isTemporary } = this.props;
    return (
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
    );
  }

  renderImage = (image: IImage, index: number) => {
    const { isTemporary, onDeleteImage } = this.props;
    const src = isTemporary ? image.preview : `http://localhost:3000/${image.path}/${image.thumbName}`;
    return (
      <ImageSource>
        <img src={src} onLoad={this.props.onLoadImage} draggable={!isTemporary} />
        <Button variant="fab" color="secondary" aria-label="remove" onClick={onDeleteImage(index)}>
          <DeleteIcon />
        </Button>
      </ImageSource>
    );
  }

  renderImageWrapper = (image: IImage, index, array) => {
    const { isTemporary, onSortImages } = this.props;
    const ImgWrapper = isTemporary ? Image : SortableImage;
    const key = image.id ? image.id : index;

    return (
      <ImgWrapper
        isTemporary={isTemporary}
        key={key}
        onSortItems={onSortImages}
        items={array}
        sortId={index}
      >
        {this.renderImage(image, index)}
        {this.renderUploadProgress()}
        {this.renderUploadResult()}
      </ImgWrapper>
    );
  }

  render() {
    const { isTemporary, label, images } = this.props;
    return (
      <ImagePreviewWrapper isTemporary={isTemporary}>
        <InputLabel>{label}</InputLabel>
        <Images>
          {images.map(this.renderImageWrapper)}
        </Images>
      </ImagePreviewWrapper>
    );
  }
}
