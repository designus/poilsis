import * as React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import { TextInput, Button } from 'components';
import { withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';

import { styles } from './styles';

export const ITEM_DESCRIPTION_FORM_NAME = 'ItemDescriptionForm';

interface ICustomProps extends WithStyles<typeof styles> {
  formatMessage: (messages: FormattedMessage.MessageDescriptor) => string;
  selectedLanguage?: string;
}

const Form = (props: ICustomProps & InjectedFormProps<{}, ICustomProps>)  => {
  const { handleSubmit, submitting, pristine, selectedLanguage, formatMessage, classes } = props;

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Field
        name="description"
        type="text"
        component={TextInput}
        label={formatMessage({ id: 'admin.common_fields.description'})}
        intl
        selectedLanguage={selectedLanguage}
        multiline
      />
      <Typography variant="caption" className={classes.root}>
        <FormattedMessage
          id="admin.item.seo_info"
          defaultMessage="To get your ad indexed by search engines better please fill the following fields"/>
      </Typography>
      <Field
        name="metaTitle"
        type="text"
        component={TextInput}
        label={formatMessage({ id: 'admin.common_fields.meta_title'})}
        intl
        selectedLanguage={selectedLanguage}
      />
      <Field
        name="metaDescription"
        type="text"
        component={TextInput}
        label={formatMessage({ id: 'admin.common_fields.meta_description'})}
        intl
        selectedLanguage={selectedLanguage}
      />
      <Field
        name="metaKeywords"
        type="text"
        component={TextInput}
        label={formatMessage({ id: 'admin.common_fields.meta_keywords'})}
        intl
        selectedLanguage={selectedLanguage}
      />
      <div>
        <Button type="submit" disabled={submitting || pristine}>
          <FormattedMessage id="common.submit" />
        </Button>
      </div>
    </form>
  );
};

const FormComponent = reduxForm<{}, ICustomProps>({ form: ITEM_DESCRIPTION_FORM_NAME  })(Form);

export const MainInfoForm = withStyles(styles)(FormComponent);
