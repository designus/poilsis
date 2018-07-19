import * as React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { DropzoneInput, UploadedImages, Button } from 'components';
import { maxUploadedPhotos } from 'global-utils';

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

  submitImages = (images) => {
    this.props.onSubmit({ ...images, isUpdateAction: true });
  }

  render() {
    const { handleSubmit, submitting, pristine } = this.props;
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
        <Button onClick={handleSubmit(this.submitImages)} disabled={submitting || pristine}>
          Save
        </Button>
      </form>
    );
  }
}

export const PhotosForm = reduxForm<{}, ICustomProps>({ form: 'PhotosForm' })(FormComponent);
