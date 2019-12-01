import * as React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Dispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { getDropdownOptions } from 'client-utils/methods';
import { adminRoutes } from 'client-utils/routes';
import { asyncValidateAlias } from 'actions';
import {
  isAdmin,
  itemValidation,
  isRequired,
  requiredWhenEnabled,
  minCheckedCount,
  maxCheckedCount,
  IItem,
  DEFAULT_LANGUAGE
} from 'global-utils';

import { Button } from 'components/button';
import { TextInput } from 'components/formFields/textInput';
import { CheckboxGroup } from 'components/formFields/checkboxGroup';
import { SelectBox } from 'components/formFields/selectBox';
import { Switcher } from 'components/formFields/switch';

import { Props, ICustomProps } from './types';

const minTypesCount = minCheckedCount(itemValidation.types.minCheckedCount);
const maxTypesCount = maxCheckedCount(itemValidation.types.maxCheckedCount);

export const MAIN_INFO_FORM_NAME = 'MainInfoForm';

const Form = (props: Props)  => {
  const { handleSubmit, submitting, pristine, selectedLanguage, intl, locale } = props;

  const isHidden = () => selectedLanguage !== DEFAULT_LANGUAGE;

  const handleBackClick = () => props.history.push(adminRoutes.items.getLink());

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Field
        name="name"
        type="text"
        component={TextInput}
        validate={[requiredWhenEnabled]}
        label={intl.formatMessage({ id: 'admin.common_fields.name'})}
        hasIntl
        selectedLanguage={selectedLanguage}
      />
      <Field
        name="alias"
        type="text"
        hasIntl
        component={TextInput}
        selectedLanguage={selectedLanguage}
        label={intl.formatMessage({ id: 'admin.common_fields.alias'})}
      />
      <Field
        name="address"
        type="text"
        validate={[isRequired]}
        component={TextInput}
        selectedLanguage={selectedLanguage}
        label={intl.formatMessage({ id: 'admin.common_fields.address'})}
      />
      <Field
        name="cityId"
        component={SelectBox}
        validate={[isRequired]}
        isHidden={isHidden()}
        label={intl.formatMessage({ id: 'admin.common_fields.city'})}
        options={getDropdownOptions(props.citiesMap, 'name', locale)}
      />
      {isAdmin(props.userRole) &&
        <Field
          name="userId"
          component={SelectBox}
          validate={[isRequired]}
          label={intl.formatMessage({ id: 'admin.common_fields.user'})}
          isHidden={isHidden()}
          data={props.usersMap}
          options={getDropdownOptions(props.usersMap, 'name', locale)}
        />
      }
      <Field
        name="types"
        component={CheckboxGroup}
        validate={[minTypesCount, maxTypesCount]}
        label={intl.formatMessage({ id: 'admin.common_fields.types'})}
        isHidden={isHidden()}
        options={getDropdownOptions(props.typesMap, 'name', locale)}
      />
      <Field
        name="isEnabled"
        component={Switcher}
        selectedLanguage={selectedLanguage}
        hasIntl
        label={intl.formatMessage({ id: 'admin.common_fields.is_enabled'})}
      />
      {isAdmin(props.userRole) &&
        <Field
          name="isApprovedByAdmin"
          component={Switcher}
          selectedLanguage={selectedLanguage}
          label={intl.formatMessage({ id: 'admin.common_fields.approved_by_admin'})}
        />
      }
      <div>
        <Button onClick={handleBackClick} type="button" variant="outlined" color="default">
          <FormattedMessage id="common.cancel" />
        </Button>
        <Button type="submit" variant="contained" disabled={submitting || pristine}>
          <FormattedMessage id="common.submit" />
        </Button>
      </div>
    </form>
  );
};

export const MainInfoForm = withRouter(
  reduxForm<IItem, ICustomProps>({
    asyncValidate: (item: IItem, dispatch: Dispatch<any>, props) => {
      return asyncValidateAlias(item, '/api/items/item/alias-exist', props.intl);
    },
    asyncBlurFields: ['alias'],
    form: MAIN_INFO_FORM_NAME
  })(Form)
);
