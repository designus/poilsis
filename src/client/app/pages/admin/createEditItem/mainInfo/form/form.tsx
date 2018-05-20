import * as React from 'react';

import {
  CheckboxGroup,
  SelectBox,
  TextInput,
  Button,
} from '../../../../../components';
import { IAddItemProps } from '../../../../../pages';
import {
  NAME_LABEL,
  CITY_LABEL,
  TYPES_LABEL,
  ADDRESS_LABEL,
  SAVE_LABEL,
  NAME_KEY,
  CITY_KEY,
  TYPES_KEY,
  ADDRESS_KEY,
  USER_LABEL,
  USER_KEY,
} from '../../../../../../../data-strings';
import { isAdmin } from '../../../../../../../global-utils';

export const Form = (props: IAddItemProps) => {
  const {showErrors, errors, fields} = props.state;
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
      {isAdmin(this.props.userRole) &&
        <SelectBox
          label={USER_LABEL}
          value={fields[USER_KEY]}
          onChange={props.handleInputChange(USER_KEY)}
          showErrors={showErrors}
          errors={errors[USER_KEY]}
          data={props.usersMap}
        />
      }
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
      <Button>
        {SAVE_LABEL}
      </Button>
    </form>
  );
};
