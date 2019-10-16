import * as React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { SubmissionError, isDirty, isSubmitting } from 'redux-form';
import reduxFormActions from 'redux-form/es/actions';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import { EditorState } from 'draft-js';

import { IAppState } from 'types';
import { updateItemDescription } from 'actions/items';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { getBackendErrors } from 'client-utils/methods';
import { IItem, IItemDescFields, getItemDescriptionFields, TranslatableField } from 'global-utils';
import { stateToHTML } from 'draft-js-export-html';
import { extendWithLoader } from 'components/extendWithLoader';
import { extendWithLanguage } from 'components/extendWithLanguage';
import { NavigationPrompt } from 'components/navigationPrompt';

import { ICreateEditItemPageProps } from '../createEditItem';
import { MainInfoForm, ITEM_DESCRIPTION_FORM_NAME } from './form';

const FormWithLoader = extendWithLoader(extendWithLanguage(MainInfoForm));
const { initialize } = reduxFormActions;

type TranslatableEditorState = Record<keyof TranslatableField, EditorState>;

type ISubmitDescFields = {
  [K in keyof IItemDescFields]: K extends 'description' ? TranslatableEditorState : TranslatableField
};

interface IDescriptionProps extends ICreateEditItemPageProps, InjectedIntlProps {
  userRole: string;
  showNavigationPrompt: boolean;
  updateItemDescription: (itemId: string, description: IItemDescFields) => Promise<void>;
  initializeForm: (description: IItemDescFields) => void;
}

class DescriptionPage extends React.Component<IDescriptionProps, any> {

  constructor(props) {
    super(props);
  }

  handleErrors(errors) {
    throw new SubmissionError(getBackendErrors(errors));
  }

  mapEditorStateToHtml = (description: TranslatableEditorState): TranslatableField  => {
    return Object.keys(description).reduce((acc: any, key: string) => {
      acc[key] = stateToHTML(description[key].getCurrentContent());
      return acc;
    }, {});
  }

  getUpdatedDescription = (fields: ISubmitDescFields): IItemDescFields => ({
    ...fields,
    description: this.mapEditorStateToHtml(fields.description)
  })

  onSubmit = (descFields: ISubmitDescFields) => {
    const updatedDescription = this.getUpdatedDescription(descFields);
    return this.props.updateItemDescription(this.props.loadedItem.id, updatedDescription)
      .then(() => this.props.initializeForm(updatedDescription))
      .catch(this.handleErrors);
  }

  render() {
    return this.props.loadedItem ? (
      <div>
        <Typography variant="h5">
          <FormattedMessage id="admin.menu.description" />
        </Typography>
        <FormWithLoader
          onSubmit={this.onSubmit}
          loaderId={CONTENT_LOADER_ID}
          showLoadingOverlay={true}
          intl={this.props.intl}
          initialValues={getItemDescriptionFields(this.props.loadedItem)}
        />
        <NavigationPrompt when={this.props.showNavigationPrompt} />
      </div>
    ) : null;
  }
}

const mapStateToProps = (state: IAppState) => ({
  showNavigationPrompt: isDirty(ITEM_DESCRIPTION_FORM_NAME)(state) && !isSubmitting(ITEM_DESCRIPTION_FORM_NAME)(state)
});

const mapDispatchToProps = (dispatch) => ({
  updateItemDescription: (itemId: string, description: IItem) =>
    dispatch(updateItemDescription(itemId, description)),
  initializeForm: (data: IItem) => dispatch(initialize(ITEM_DESCRIPTION_FORM_NAME, data))
});

export default injectIntl(
  connect<any, any, IDescriptionProps>(mapStateToProps, mapDispatchToProps)(DescriptionPage)
);
