import * as React from 'react';

import { CheckboxGroup,	SelectBox, TextInput, Submit, FileUpload } from '../../../../components';
import { IAddItemProps } from '../../../../pages';
import {
  NAME_LABEL,
  CITY_LABEL,
  TYPES_LABEL,
  ADDRESS_LABEL,
  SEND_LABEL,
  IMAGES_LABEL,
  NAME_KEY,
  CITY_KEY,
  TYPES_KEY,
  ADDRESS_KEY,
  IMAGES_KEY,
} from '../../../../data-strings';

export const CreateEditItem = (props: IAddItemProps) => {
  const {showErrors, errors, fields} = props.state;
  const id = fields.id;
  return (
    <form onSubmit={props.handleSubmit} autoComplete="off">
      <TextInput
        label={NAME_LABEL}
        value={fields[NAME_KEY]}
        showErrors={showErrors}
        errors={errors[NAME_KEY]}
        onChange={props.handleInputChange(NAME_KEY)}
        onBlur={props.handleOnBlur}
      />
      <SelectBox
        label={CITY_LABEL}
        value={fields[CITY_KEY]}
        onChange={props.handleInputChange(CITY_KEY)}
        showErrors={showErrors}
        errors={errors[CITY_KEY]}
        data={props.citiesMap}
      />
      <CheckboxGroup
        label={TYPES_LABEL}
        showErrors={showErrors}
        errors={errors[TYPES_KEY]}
        onChange={props.handleCheckboxToggle(TYPES_KEY)}
        data={props.typesMap}
        checkedItems={fields[TYPES_KEY]}
      />
      <TextInput
        label={ADDRESS_LABEL}
        value={fields[ADDRESS_KEY]}
        showErrors={showErrors}
        errors={errors[ADDRESS_KEY]}
        onChange={props.handleInputChange(ADDRESS_KEY)}
        onBlur={props.handleOnBlur}
      />
      <FileUpload
        label={IMAGES_LABEL}
        images={fields[IMAGES_KEY]}
        addImages={props.handleAddedImages}
        removeImage={props.handleRemovedImage}
        id={id}
      />
      <Submit>
        {SEND_LABEL}
      </Submit>
    </form>
  );
};
