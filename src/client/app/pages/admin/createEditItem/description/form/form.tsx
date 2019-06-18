import * as React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';

import { Button } from 'components';
import { TextEditor } from 'components/formFields/textEditor';
import { TextInput } from 'components/formFields/textInput';

import { styles } from './styles';

export const ITEM_DESCRIPTION_FORM_NAME = 'ItemDescriptionForm';

interface ICustomProps extends WithStyles<typeof styles> {
  formatMessage: (messages: FormattedMessage.MessageDescriptor) => string;
  selectedLanguage?: string;
}

class Form extends React.Component<ICustomProps & InjectedFormProps<{}, ICustomProps>> {

  render() {
    const { handleSubmit, selectedLanguage, formatMessage, classes } = this.props;

    return (
      <form onSubmit={handleSubmit} autoComplete="off">
        <Field
          name="description"
          type="text"
          component={TextEditor}
          label={formatMessage({ id: 'admin.common_fields.description'})}
          selectedLanguage={selectedLanguage}
        />
        <Typography variant="caption" className={classes.root}>
          <FormattedMessage
            id="admin.item.seo_info"
            defaultMessage="To get your ad indexed by search engines better please fill the following fields"/>
        </Typography>
        <div className={classes.metaContent}>
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
        </div>
        <Button type="submit">
          <FormattedMessage id="common.submit" />
        </Button>
      </form>
    );
  }
}

const FormComponent = reduxForm<{}, ICustomProps>({ form: ITEM_DESCRIPTION_FORM_NAME  })(Form);

export const MainInfoForm = withStyles(styles)(FormComponent);
