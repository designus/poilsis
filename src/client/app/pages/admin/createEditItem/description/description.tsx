import * as React from 'react';
import { connect } from 'react-redux';
import { SubmissionError, isDirty, isSubmitting } from 'redux-form';
// @ts-ignore
import reduxFormActions from 'redux-form/es/actions';
import { injectIntl } from 'react-intl';

import { IAppState, ThunkDispatch } from 'types';
import { updateItemDescription } from 'actions/items';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { getBackendErrors } from 'client-utils/methods';
import { IItemDescFields, getItemDescriptionFields, ObjectKeys } from 'global-utils';
import { TranslatableField } from 'global-utils/data-models';
import { stateToHTML } from 'draft-js-export-html';
import { extendWithLoader } from 'components/extendWithLoader';
import { extendWithLanguage } from 'components/extendWithLanguage';
import { NavigationPrompt } from 'components/navigationPrompt';

import { IOwnProps, IStateProps, IDispatchProps, Props, TranslatableEditorState, ISubmitDescFields } from './types';
import { MainInfoForm, ITEM_DESCRIPTION_FORM_NAME } from './form';

const FormWithLoader = extendWithLoader(extendWithLanguage(MainInfoForm));
const { initialize } = reduxFormActions;

class DescriptionPage extends React.Component<Props> {
  handleErrors(errors: any) {
    throw new SubmissionError(getBackendErrors(errors));
  }

  mapEditorStateToHtml = (description: TranslatableEditorState): TranslatableField  => {
    const keys = Object.keys(description) as ObjectKeys<typeof description>;
    return keys.reduce((acc: any, key) => {
      acc[key] = typeof description[key] === 'string' ? description[key] : stateToHTML(description[key].getCurrentContent());
      return acc;
    }, {});
  }

  getUpdatedDescription = (fields: ISubmitDescFields): IItemDescFields => ({
    ...fields,
    description: this.mapEditorStateToHtml(fields.description as TranslatableEditorState)
  })

  onSubmit = (fields: any) => {
    const descFields = fields as ISubmitDescFields;
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

const mapStateToProps = (state: IAppState): IStateProps => ({
  showNavigationPrompt: isDirty(ITEM_DESCRIPTION_FORM_NAME)(state) && !isSubmitting(ITEM_DESCRIPTION_FORM_NAME)(state)
});

const mapDispatchToProps = (dispatch: ThunkDispatch): IDispatchProps => ({
  updateItemDescription: (itemId, description) => dispatch(updateItemDescription(itemId, description)),
  initializeForm: data => dispatch(initialize(ITEM_DESCRIPTION_FORM_NAME, data))
});

export default injectIntl(
  connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(mapStateToProps, mapDispatchToProps)(DescriptionPage)
);
