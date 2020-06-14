import * as React from 'react';
import { connect } from 'react-redux';
import { SubmissionError, isDirty, isSubmitting } from 'redux-form';
// @ts-ignore
import reduxFormActions from 'redux-form/es/actions';
import { injectIntl } from 'react-intl';

import { getTypesMap, getUsersMap, getCitiesMap, getCurrentUserRole, getAdminLocale } from 'selectors';
import { IAppState, ThunkDispatch } from 'types';
import { updateMainInfo, createItem } from 'actions/items';
import { getBackendErrors } from 'client-utils/methods';
import { adminRoutes } from 'client-utils/routes';
import { CONTENT_LOADER_ID } from 'client-utils/constants';
import { Item } from 'global-utils/data-models';
import { LANGUAGES, DEFAULT_LANGUAGE } from 'global-utils';
import { extendWithLoader } from 'components/extendWithLoader';
import { extendWithLanguage } from 'components/extendWithLanguage';
import { NavigationPrompt } from 'components/navigationPrompt';
import { MainInfoForm, MAIN_INFO_FORM_NAME } from './form';

import { Props, IOwnProps, IStateProps, IDispatchProps } from './types';

const FormWithLoader = extendWithLoader(extendWithLanguage(MainInfoForm));
const { initialize } = reduxFormActions;

class MainInfoPage extends React.Component<Props> {

  handleErrors(errors: any) {
    throw new SubmissionError(getBackendErrors(errors));
  }

  onSubmit = (item: Item) => {
    const { isCreatePage, createItem, history, updateItem, initializeForm } = this.props;
    const submitFn = isCreatePage ? createItem : updateItem;
    return submitFn({ ...item, currency: 'EUR' })
      .then(newItem => {
        if (isCreatePage) {
          history.push(adminRoutes.editItemMain.getLink(newItem.userId, newItem.id));
        } else {
          initializeForm(newItem);
        }
      })
      .catch(this.handleErrors);
  }

  render() {
    return (this.props.loadedItem || this.props.isCreatePage) ? (
      <React.Fragment>
        <FormWithLoader
          onSubmit={this.onSubmit}
          loaderId={CONTENT_LOADER_ID}
          showLoadingOverlay={true}
          citiesMap={this.props.citiesMap}
          locale={this.props.locale}
          intl={this.props.intl}
          typesMap={this.props.typesMap}
          userRole={this.props.userRole}
          usersMap={this.props.usersMap}
          initialValues={this.props.loadedItem}
          languages={LANGUAGES}
          defaultLanguage={DEFAULT_LANGUAGE}
        />
        <NavigationPrompt when={this.props.showNavigationPrompt} />
      </React.Fragment>
    ) : null;
  }
}

const mapStateToProps = (state: IAppState): IStateProps => ({
  usersMap: getUsersMap(state),
  citiesMap: getCitiesMap(state),
  typesMap: getTypesMap(state),
  userRole: getCurrentUserRole(state),
  showNavigationPrompt: isDirty(MAIN_INFO_FORM_NAME)(state) && !isSubmitting(MAIN_INFO_FORM_NAME)(state),
  locale: getAdminLocale(state)
});

const mapDispatchToProps = (dispatch: ThunkDispatch): IDispatchProps => ({
  updateItem: item => dispatch(updateMainInfo(item)),
  createItem: item => dispatch(createItem(item)),
  initializeForm: item => dispatch(initialize(MAIN_INFO_FORM_NAME, item))
});

export default injectIntl(
  connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(mapStateToProps, mapDispatchToProps)(MainInfoPage)
);
