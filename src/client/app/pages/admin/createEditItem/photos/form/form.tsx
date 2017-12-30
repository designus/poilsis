import * as React from 'react';

import { Button, FileUpload } from '../../../../../components';
import { IAddItemProps } from '../../../../../pages';
import { SEND_LABEL, IMAGES_LABEL, IMAGES_KEY } from '../../../../../../../data-strings';
export const Form = (props: IAddItemProps) => {
  const {
    // showErrors,
    // errors,
    fields,
  } = props.state;
  const id = fields.id;
  return (
    <form onSubmit={props.handleSubmit} autoComplete="off">
      <FileUpload
        label={IMAGES_LABEL}
        addImages={props.handleAddedImages}
        uploadImages={props.uploadImages}
        images={fields[IMAGES_KEY]}
        isCreate={props.isCreate}
        id={id}
      />
      <Button>
        {SEND_LABEL}
      </Button>
    </form>
  );
};
