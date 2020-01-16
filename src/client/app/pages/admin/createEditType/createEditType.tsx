import * as React from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { SubmissionError, isDirty, isSubmitting } from 'redux-form';
import reduxFormActions from 'redux-form/es/actions';

import { injectIntl, defineMessages } from 'react-intl';

import { IType, LANGUAGES, DEFAULT_LANGUAGE, isClient } from 'global-utils';
import { createType, updateType, getAdminType } from 'actions/types';
import { getBackendErrors } from 'client-utils/methods';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { adminRoutes } from 'client-utils/routes';
import { extendWithLoader } from 'components/extendWithLoader';
import { extendWithLanguage } from 'components/extendWithLanguage';
import { NavigationPrompt } from 'components/navigationPrompt';
import { Loader } from 'components/loader';
import { IAppState, ThunkDispatch } from 'types';
import { shouldLoadType, getTypeById } from 'selectors';

import { TypeForm, TYPE_FORM_NAME } from './form';

import { IOwnProps, IStateProps, IDispatchProps, Props } from './types';

const { initialize } = reduxFormActions;
const FormWithLoader = extendWithLoader(extendWithLanguage(TypeForm));

const messages = defineMessages({
  createType: {
    id: 'admin.type.create_title',
    defaultMessage: 'Create type'
  },
  editType: {
    id: 'admin.type.edit_title',
    defaultMessage: 'Edit type'
  }
});

class CreateEditTypePageComponent extends React.Component<Props> {

  componentDidMount() {
    if (!this.isCreatePage() && this.props.shouldLoadType) {
      this.props.getType(this.props.match.params.typeId);
    }
  }

  handleErrors(errors: any) {
    throw new SubmissionError(getBackendErrors(errors));
  }

  isCreatePage = () => !Boolean(this.props.match.params.typeId);

  onSubmit = (type: IType) => {
    const { createType, history, updateType, initializeForm } = this.props;
    const submitFn = this.isCreatePage() ? createType : updateType;
    return submitFn(type)
      .then((newType: IType) => {
        if (this.isCreatePage()) {
          history.push(adminRoutes.editType.getLink(newType.id));
        } else {
          initializeForm(newType);
        }
      })
      .catch(this.handleErrors);
  }

  renderTitle = () => {
    return isClient() && ReactDOM.createPortal(
      <span> / {this.props.intl.formatMessage(this.isCreatePage() ? messages.createType : messages.editType)}</span>,
      document.querySelector('.editItemName')
    );
  }

  render() {
    return (this.props.loadedType || this.isCreatePage()) && (
      <React.Fragment>
        {this.renderTitle()}
        <FormWithLoader
          onSubmit={this.onSubmit}
          intl={this.props.intl}
          loaderId={CONTENT_LOADER_ID}
          showLoadingOverlay={true}
          initialValues={this.props.loadedType}
          languages={LANGUAGES}
          defaultLanguage={DEFAULT_LANGUAGE}
        />
        <NavigationPrompt when={this.props.showNavigationPrompt} />
      </React.Fragment>
    ) || <Loader isLoading />;
  }
}

const mapStateToProps = (state: IAppState, props: IOwnProps): IStateProps => ({
  loadedType: getTypeById(state, props.match.params.typeId),
  showNavigationPrompt: isDirty(TYPE_FORM_NAME)(state) && !isSubmitting(TYPE_FORM_NAME)(state),
  shouldLoadType: shouldLoadType(state, props.match.params.typeId)
});

const mapDispatchToProps = (dispatch: ThunkDispatch): IDispatchProps => ({
  getType: typeId => dispatch(getAdminType(typeId)),
  createType: type => dispatch(createType(type)),
  updateType: type => dispatch(updateType(type)),
  initializeForm: type => dispatch(initialize(TYPE_FORM_NAME, type))
});

export const CreateEditTypePage = injectIntl(
  connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(mapStateToProps, mapDispatchToProps)(CreateEditTypePageComponent)
);
