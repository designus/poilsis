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

import { IOwnProps, IStateProps, IDispatchProps, DescriptionPageProps, TranslatableEditorState, ISubmitDescFields } from './types';
import { MainInfoForm, ITEM_DESCRIPTION_FORM_NAME } from './form';

const FormWithLoader = extendWithLoader(extendWithLanguage(MainInfoForm));
const { initialize } = reduxFormActions;

class DescriptionPage extends React.Component<DescriptionPageProps, any> {

  constructor(props) {
    super(props);
  }

  handleErrors(errors) {
    throw new SubmissionError(getBackendErrors(errors));
  }

  mapEditorStateToHtml = (description: TranslatableEditorState): TranslatableField  => {
    return Object.keys(description).reduce((acc: any, key: string) => {
      acc[key] = typeof description[key] === 'string' ? description[key] : stateToHTML(description[key].getCurrentContent());
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
      <React.Fragment>
        <FormWithLoader
          onSubmit={this.onSubmit}
          loaderId={CONTENT_LOADER_ID}
          showLoadingOverlay={true}
          intl={this.props.intl}
          initialValues={getItemDescriptionFields(this.props.loadedItem)}
        />
        <NavigationPrompt when={this.props.showNavigationPrompt} />
      </React.Fragment>
    ) : null;
  }
}

const mapStateToProps = (state: IAppState) => ({
  showNavigationPrompt: isDirty(ITEM_DESCRIPTION_FORM_NAME)(state) && !isSubmitting(ITEM_DESCRIPTION_FORM_NAME)(state)
});

const mapDispatchToProps = (dispatch) => ({
  updateItemDescription: (itemId: string, description: IItemDescFields) => dispatch(updateItemDescription(itemId, description)),
  initializeForm: (data: IItem) => dispatch(initialize(ITEM_DESCRIPTION_FORM_NAME, data))
});

export default injectIntl(
  connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(mapStateToProps, mapDispatchToProps)(DescriptionPage)
);
