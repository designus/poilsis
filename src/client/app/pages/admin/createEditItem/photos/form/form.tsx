import * as React from 'react';
import { connect } from 'react-redux';
import { Button, FileUpload, ImagePreview, ValidationErrors } from '../../../../../components';
import { IAddItemProps } from '../../../../../pages';
import { SAVE_LABEL, IMAGES_LABEL, IMAGES_KEY, ERROR_HEADER } from '../../../../../../../data-strings';
import {
  IImage,
  maxFileCount,
  maxFileSize,
  wrongFileType,
  MAX_FILE_COUNT,
  MAX_FILE_SIZE_B,
  MAX_FILE_SIZE_MB,
  ALLOWED_MIME_TYPES,
  mapMimeTypesToTypes,
} from '../../../../../../../global-utils';
import { IAppState, IUploadProgress } from '../../../../../reducers';
import { setInitialUploadState, uploadPhotos } from '../../../../../actions';
import { UPLOADED_ANIMATION_DURATION } from '../../../../../client-utils';

interface IPhotosFormProps extends IUploadProgress, IAddItemProps {
  setInitialUploadState?: () => void;
}

class FormComponent extends React.Component<IPhotosFormProps, any> {

  constructor(props: IPhotosFormProps) {
    super(props);
    this.state = {
      droppedImages: [],
      errors: [],
      uploadedImages: this.props.state.fields[IMAGES_KEY],
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({uploadedImages: this.props.state.fields[IMAGES_KEY], errors: []});
  }

  resetUploadState() {
    setTimeout(() => {
      this.props.setInitialUploadState();
      this.clearDroppedImages();
    }, UPLOADED_ANIMATION_DURATION);
  }

  clearDroppedImages = () => {
    this.setState({droppedImages: [], errors: []});
  }

  setImagesState(images) {
    this.props.setNewState(IMAGES_KEY)(images);
  }

  onLoadImage = (e) => {
    this.resetUploadState();
  }

  getImageError(image) {
    if (image.size > MAX_FILE_SIZE_B) {
      return maxFileSize(MAX_FILE_SIZE_MB)(image.name);
    } else if (ALLOWED_MIME_TYPES.indexOf(image.type) === -1) {
      return wrongFileType(mapMimeTypesToTypes(ALLOWED_MIME_TYPES))(image.name);
    } else  {
      return null;
    }
  }

  onDrop = (acceptedImages, rejectedImages) => {
    let errors = [];
    let droppedImages = [...this.state.droppedImages, ...acceptedImages];
    if (this.state.uploadedImages.length + acceptedImages.length > MAX_FILE_COUNT) {
      errors.push(maxFileCount(MAX_FILE_COUNT)(IMAGES_KEY));
      droppedImages = [];
    } else if (rejectedImages.length) {
      errors = rejectedImages.map(this.getImageError).filter(Boolean);
    }

    this.setState({
      droppedImages,
      errors,
    });
  }

  uploadImages = () => {
    this.props.uploadImages(this.props.state.fields.id, this.state.droppedImages).catch(err => {
      console.error(err);
      this.resetUploadState();
    });
  }

  onDeleteImage = (index: number, isTemporary: boolean) => (e: MouseEvent) => {
    e.stopPropagation();
    if (isTemporary) {
      const droppedImages = this.state.droppedImages;
      droppedImages.splice(index, 1);
      this.setState({droppedImages});
    } else {
      const images = this.state.uploadedImages;
      images.splice(index, 1);
      this.setImagesState(images);
    }
  }

  onSortImages = (isTemporary: boolean) => (images: IImage[]) => {
    if (!isTemporary) {
      this.setImagesState(images);
    }
  }

  getImagePreviewLabel = () => {
    return `${IMAGES_LABEL} (${this.state.uploadedImages.length} of ${MAX_FILE_COUNT})`;
  }

  render() {
    return (
      <form onSubmit={this.props.handleSubmit} autoComplete="off">
        <FileUpload
          id={this.props.state.fields.id}
          onDrop={this.onDrop}
          showUploadButtons={this.state.droppedImages.length}
          clearImages={this.clearDroppedImages}
          uploadImages={this.uploadImages}
        >
          <ImagePreview
            images={this.state.droppedImages}
            onDeleteImage={this.onDeleteImage}
            hasError={this.props.hasError}
            onSortImages={this.onSortImages(true)}
            progress={this.props.progress}
            isUploaded={this.props.isUploaded}
            isUploading={this.props.isUploading}
            isTemporary={true}
          />
        </FileUpload>
        <ValidationErrors
          header={ERROR_HEADER}
          showErrors={this.state.errors.length > 0}
          errors={this.state.errors}
        />
        <ImagePreview
          label={this.getImagePreviewLabel()}
          images={this.state.uploadedImages}
          onLoadImage={this.onLoadImage}
          onDeleteImage={this.onDeleteImage}
          onSortImages={this.onSortImages(false)}
          hasError={false}
          isUploaded={true}
          isUploading={false}
          isTemporary={false}
        />
        <Button>
          {SAVE_LABEL}
        </Button>
      </form>
    );
  }
}

export const mapDispatchToProps = (dispatch) => ({
  uploadImages: (itemId, files) => dispatch(uploadPhotos(itemId, files)),
  setInitialUploadState: () => dispatch(setInitialUploadState()),
});

export const mapStateToProps = (state: IAppState) => ({
  progress: state.uploadProgress.progress,
  isUploaded: state.uploadProgress.isUploaded,
  isUploading: state.uploadProgress.isUploading,
  hasError: state.uploadProgress.hasError,
});

export const Form = connect<{}, {}, IPhotosFormProps>(mapStateToProps, mapDispatchToProps)(FormComponent);
