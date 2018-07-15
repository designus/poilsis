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
  onLoadImage: any;
}

class UploadedImagesComponent extends React.Component<IUploadedImagesParams, any> {

  constructor(props: IUploadedImagesParams) {
    super(props);
    this.state = {
      images: [],
      isSorted: false,
    };
  }

  static getDerivedStateFromProps(nextProps, oldState) {
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
    this.props.input.onChange(images);
  }

  onSortImages = (images: IImage[]) => {
    this.setState({ images });
    this.props.input.onChange(images);
  }

  getImagePreviewLabel = () => {
    return `${IMAGES_LABEL} (${this.props.input.value.length} of ${MAX_FILE_COUNT})`;
  }

  render() {
    return (
      <ImagePreview
        label={this.getImagePreviewLabel()}
        images={this.state.images}
        onLoadImage={this.props.onLoadImage}
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
