import * as React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { DropzoneInput, UploadedImages, Button } from 'components';
import { maxUploadedPhotos } from 'global-utils';
import { UPLOADED_ANIMATION_DURATION } from 'client-utils';

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

  onLoadImage = (e) => {
    setTimeout(() => {
      this.props.setInitialUploadState();
      this.clearDroppedImages();
    }, UPLOADED_ANIMATION_DURATION);
  }

  submitImages = (images) => {
    this.props.onSubmit({ ...images, isUpdateAction: true });
  }

  render() {
    const { handleSubmit } = this.props;
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
          onLoadImage={this.onLoadImage}
        />
        <Button onClick={handleSubmit(this.submitImages)}>
          Save
        </Button>
      </form>
    );
  }
}

export const PhotosForm = reduxForm<{}, ICustomProps>({ form: 'PhotosForm' })(FormComponent);
