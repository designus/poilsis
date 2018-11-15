import * as React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { DropzoneInput, UploadedImages, Button } from 'components';
import { maxUploadedPhotos, maxUploadedPhotoSize } from 'global-utils';
import { IPhotosFormFields } from '../photos';

export const PHOTOS_FORM_NAME = 'PhotosForm';

const validators = [
  maxUploadedPhotos,
  maxUploadedPhotoSize,
];

interface ICustomProps {
  isDirty: boolean;
  setInitialUploadState: () => void;
  onSubmit: (fields: IPhotosFormFields) => void;
}

type FormProps = ICustomProps & InjectedFormProps<{}, ICustomProps>;

class FormComponent extends React.Component<FormProps> {

  clearDroppedImages = () => {
    this.props.change('files', []);
  }

  onLoadedImages = () => {
    this.props.setInitialUploadState();
    this.clearDroppedImages();
  }

  submitImages = (fields: IPhotosFormFields) => {
    this.props.onSubmit({ ...fields, isUpdateAction: true });
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
        <Field
          name="images"
          component={UploadedImages}
          onLoadedImages={this.onLoadedImages}
        />
        <Button
          onClick={this.props.handleSubmit(this.submitImages)}
          disabled={!this.props.isDirty}
        >
          Save
        </Button>
      </form>
    );
  }
}

export const PhotosForm = reduxForm<{}, ICustomProps>({ form: PHOTOS_FORM_NAME })(FormComponent);
