import * as React from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { adminRoutes } from 'client-utils/routes';
import { AdminFormActions } from 'components/adminFormActions';
import { TextEditor } from 'components/formFields/textEditor';
import { TextInput } from 'components/formFields/textInput';
import { Props, ICustomProps } from './types';

import { styles } from './styles';

export const ITEM_DESCRIPTION_FORM_NAME = 'ItemDescriptionForm';

class Form extends React.Component<Props> {

  render() {
    const { handleSubmit, selectedLanguage, intl, classes } = this.props;

    return (
      <form onSubmit={handleSubmit} autoComplete="off">
        <Field
          name="description"
          type="text"
          component={TextEditor}
          label={intl.formatMessage({ id: 'admin.common_fields.description'})}
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
            label={intl.formatMessage({ id: 'admin.common_fields.meta_title'})}
            hasIntl
            selectedLanguage={selectedLanguage}
          />
          <Field
            name="metaDescription"
            type="text"
            component={TextInput}
            label={intl.formatMessage({ id: 'admin.common_fields.meta_description'})}
            hasIntl
            selectedLanguage={selectedLanguage}
          />
        </div>
        <AdminFormActions backLink={adminRoutes.items.getLink()} />
      </form>
    );
  }
}

const FormComponent = reduxForm<{}, ICustomProps>({ form: ITEM_DESCRIPTION_FORM_NAME  })(Form);

export const MainInfoForm = withStyles(styles)(FormComponent);
