import * as React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { DropzoneInput, UploadedImages, Button } from 'components';
import { maxUploadedPhotos } from 'global-utils';
import { IPhotosFormFields } from '../photos';

const validators = [
  maxUploadedPhotos,
];

interface ICustomProps {
  setInitialUploadState: () => void;
  onSubmit: any;
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
        <Button onClick={this.props.handleSubmit(this.submitImages)}>
          Save
        </Button>
      </form>
    );
  }
}

export const PhotosForm = reduxForm<{}, ICustomProps>({ form: 'PhotosForm' })(FormComponent);
