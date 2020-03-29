import * as React from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
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
  priceValidator,
  IItem,
  DEFAULT_LANGUAGE
} from 'global-utils';

import { TextInput } from 'components/formFields/textInput';
import { PriceInput } from 'components/formFields/priceInput';
import { CheckboxGroup } from 'components/formFields/checkboxGroup';
import { SelectBox } from 'components/formFields/selectBox';
import { Switcher } from 'components/formFields/switch';
import { AdminFormActions } from 'components/adminFormActions';

import { Props, ICustomProps } from './types';
import { useStyles } from './styles';

const minTypesCount = minCheckedCount(itemValidation.types.minCheckedCount);
const maxTypesCount = maxCheckedCount(itemValidation.types.maxCheckedCount);

export const MAIN_INFO_FORM_NAME = 'MainInfoForm';

const Form = (props: Props)  => {
  const { handleSubmit, submitting, pristine, selectedLanguage, intl, locale } = props;
  const classes = useStyles();
  const isHidden = () => selectedLanguage !== DEFAULT_LANGUAGE;

  const renderMainInfo = () => {
    return (
      <Paper classes={{ root: classes.paper }} square variant="outlined">
        <Typography variant="h5">
          <FormattedMessage id="admin.menu.main_info" defaultMessage="Main info" />
        </Typography>
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
      </Paper>
    );
  };

  const renderPriceInfo = () => {
    return (
      <Paper classes={{ root: classes.paper }} square variant="outlined">
        <Typography variant="h5">
          <FormattedMessage id="admin.item.price" defaultMessage="Prices" />
        </Typography>
        <Field
          name="price"
          type="text"
          component={PriceInput}
          validate={[priceValidator]}
        />
      </Paper>
    );
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Grid container spacing={3}>
        <Grid item xs={6}>
          {renderMainInfo()}
        </Grid>
        <Grid item xs={6}>
          {renderPriceInfo()}
        </Grid>
        <Grid item xs={12}>
          <AdminFormActions backLink={adminRoutes.items.getLink()} isSubmitDisabled={submitting || pristine} />
        </Grid>
      </Grid>
    </form>
  );
};

export const MainInfoForm = reduxForm<IItem, ICustomProps>({
  asyncValidate: (item: IItem, dispatch, props) => {
    return asyncValidateAlias(item, '/api/items/item/alias-exist', props.intl);
  },
  asyncBlurFields: ['alias'],
  form: MAIN_INFO_FORM_NAME
})(Form);
