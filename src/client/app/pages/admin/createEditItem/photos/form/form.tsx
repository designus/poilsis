import * as React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { maxUploadedPhotos, maxUploadedPhotoSize, IImage } from 'global-utils';

import { DropzoneInput } from 'components/formFields/dropzoneInput';
import { UploadedImages } from 'components/formFields/uploadedImages';

export const PHOTOS_FORM_NAME = 'PhotosForm';

const validators = [
  maxUploadedPhotos,
  maxUploadedPhotoSize
];

interface ICustomProps {
  images: IImage[];
  onResetUploadState: () => void;
  onSaveImages: (images: IImage[]) => void;
  onSortImages: (images: IImage[]) => void;
  formatMessage: (messages: FormattedMessage.MessageDescriptor) => string;
}

type FormProps = ICustomProps & InjectedFormProps<{}, ICustomProps>;

class FormComponent extends React.Component<FormProps> {

  clearDroppedImages = () => {
    this.props.change('files', []);
  }

  handleLoadedImages = () => {
    // this.props.onResetUploadState();
    // this.clearDroppedImages();
  }

  render() {
    return (
      <form autoComplete="off">
        <Field
          name="files"
          component={DropzoneInput}
          validate={validators}
          clearDroppedImages={this.clearDroppedImages}
          formName="PhotosForm"
        />
        <UploadedImages
          images={this.props.images}
          onSaveImages={this.props.onSaveImages}
          onSortImages={this.props.onSortImages}
          onLoadedImages={this.handleLoadedImages}
        />
      </form>
    );
  }
}

export default reduxForm<{}, ICustomProps>({
  form: PHOTOS_FORM_NAME,
  enableReinitialize: true
})(FormComponent);
