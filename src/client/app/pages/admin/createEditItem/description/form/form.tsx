import * as React from 'react';
import { compose } from 'redux';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { FormattedMessage, InjectedIntl } from 'react-intl';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import { adminRoutes } from 'client-utils/routes';
import { Button } from 'components/button';
import { TextEditor } from 'components/formFields/textEditor';
import { TextInput } from 'components/formFields/textInput';
import { ItemPageMatchParams } from '../../createEditItem';

import { styles } from './styles';

export const ITEM_DESCRIPTION_FORM_NAME = 'ItemDescriptionForm';

interface ICustomProps extends WithStyles<typeof styles>, RouteComponentProps<ItemPageMatchParams> {
  intl: InjectedIntl;
  selectedLanguage?: string;
}

class Form extends React.Component<ICustomProps & InjectedFormProps<{}, ICustomProps>> {

  handleBackClick = () => this.props.history.push(adminRoutes.items.getLink());

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
        <div>
          <Button onClick={this.handleBackClick} type="button" variant="outlined" color="default">
            <FormattedMessage id="common.cancel" />
          </Button>
          <Button type="submit" variant="contained">
            <FormattedMessage id="common.submit" />
          </Button>
        </div>
      </form>
    );
  }
}

const FormComponent = reduxForm<{}, ICustomProps>({ form: ITEM_DESCRIPTION_FORM_NAME  })(Form);

export const MainInfoForm = withStyles(styles)(
  withRouter(FormComponent)
);
