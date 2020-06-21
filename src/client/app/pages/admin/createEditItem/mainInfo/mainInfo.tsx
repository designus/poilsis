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
import { MainInfoInput } from 'global-utils/input-types';
import { LANGUAGES, DEFAULT_LANGUAGE } from 'global-utils/constants';
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

  onSubmit = (item: MainInfoInput) => {
    const { isCreatePage, createItem, history, match, updateItem, initializeForm } = this.props;
    const submitFn = isCreatePage ? createItem(item) : updateItem(item, match.params.itemId);

    return submitFn
      .then(newItem => {
        if (isCreatePage) {
          history.push(adminRoutes.editItemMain.getLink(newItem.userId, newItem.id));
        }

        initializeForm(this.getInitialValue(newItem));

      })
      .catch(this.handleErrors);
  }

  getInitialValue = (item: Item): Required<MainInfoInput> => ({
    name: item.name,
    types: item.types,
    cityId: item.cityId,
    address: item.address,
    userId: item.userId,
    isEnabled: item.isEnabled,
    isApprovedByAdmin: item.isApprovedByAdmin,
    price: item.price,
    alias: item.alias,
    currency: 'EUR'
  })

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
          itemId={this.props.match.params.itemId}
          initialValues={this.props.isCreatePage ? {} : this.getInitialValue(this.props.loadedItem)}
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
  updateItem: (item, itemId) => dispatch(updateMainInfo(item, itemId)),
  createItem: item => dispatch(createItem(item)),
  initializeForm: item => dispatch(initialize(MAIN_INFO_FORM_NAME, item))
});

export default injectIntl(
  connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(mapStateToProps, mapDispatchToProps)(MainInfoPage)
);
