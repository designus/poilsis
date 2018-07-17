import * as React from 'react';
import { WrappedFieldProps } from 'redux-form';
import { WithStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ImagePreview } from 'components';
import { IMAGES_LABEL } from 'data-strings';
import { IImage, MAX_FILE_COUNT } from 'global-utils';
import { IUploadProgress } from 'reducers';
import { styles } from './styles';

export interface IUploadedImagesParams extends WrappedFieldProps, WithStyles<typeof styles>, IUploadProgress {
  formName: string;
  uploadImages: any;
  onLoadedImages: any;
}

class UploadedImagesComponent extends React.Component<IUploadedImagesParams, any> {
  loadedImages = 0;

  constructor(props: IUploadedImagesParams) {
    super(props);
    this.state = {
      images: [],
    };
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.input.value) {
      return {
        images: nextProps.input.value,
      };
    }

    return null;
  }

  onDeleteImage = (index: number) => (e: any) => {
    e.stopPropagation();
    const images = this.props.input.value;
    images.splice(index, 1);
    this.setState({ images });
    this.loadedImages--;
    this.props.input.onChange(images);
  }

  onSortImages = (images: IImage[]) => {
    this.setState({ images });
    this.props.input.onChange(images);
  }

  onLoadImage = () => {
    this.loadedImages++;
    const { onLoadedImages } = this.props;
    if (this.loadedImages === this.state.images.length && onLoadedImages) {
      onLoadedImages();
    }
  }

  getImagePreviewLabel = () => {
    return `${IMAGES_LABEL} (${this.props.input.value.length} of ${MAX_FILE_COUNT})`;
  }

  render() {
    return (
      <ImagePreview
        label={this.getImagePreviewLabel()}
        images={this.state.images}
        onLoadImage={this.onLoadImage}
        onDeleteImage={this.onDeleteImage}
        onSortImages={this.onSortImages}
        hasError={false}
        isUploaded={true}
        isUploading={false}
        isTemporary={false}
      />
    );
  }
}

export const UploadedImages = withStyles(styles)(UploadedImagesComponent) as any;
