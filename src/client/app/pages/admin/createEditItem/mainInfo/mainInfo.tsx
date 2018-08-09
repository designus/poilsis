import * as React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { SubmissionError, isDirty, initialize, isSubmitting } from 'redux-form';

import { IAppState, IItem, IUsersMap, ICitiesMap, ITypesMap } from 'reducers';
import { updateMainInfo, postItem } from 'actions';
import { getBackendErrors, adminRoutes, CONTENT_LOADER_ID } from 'client-utils';
import { IItemFields } from 'global-utils';
import { extendWithLoader, NavigationPrompt } from 'components';
import { ICreateEditItemPageProps } from '../createEditItem';
import { MainInfoForm, MAIN_INFO_FORM_NAME } from './form';

const FormWithLoader = extendWithLoader(MainInfoForm);

interface IMainInfoProps extends ICreateEditItemPageProps {
  usersMap: IUsersMap;
  citiesMap: ICitiesMap;
  typesMap: ITypesMap;
  userRole: string;
  showNavigationPrompt: boolean;
  isCreatePage: boolean;
  loadedItem: IItem;
  createItem: (item: IItemFields) => Promise<any>;
  updateItem: (item: IItemFields) => Promise<any>;
  initializeForm: (item: IItemFields) => void;
}

class MainInfoPageComponent extends React.Component<IMainInfoProps, any> {

  constructor(props) {
    super(props);
  }

  handleErrors(errors) {
    throw new SubmissionError(getBackendErrors(errors));
  }

  onSubmit = (item: IItemFields) => {
    const { isCreatePage, createItem, history, updateItem, initializeForm } = this.props;
    const submitFn = isCreatePage ? createItem : updateItem;

    return submitFn(item)
      .then(item => {
        if (isCreatePage) {
          history.push(adminRoutes.editItemMain.getLink(item.userId, item.itemId));
        } else {
          initializeForm(item);
        }
      })
      .catch(this.handleErrors);
  }

  render() {
    return (this.props.loadedItem || this.props.isCreatePage) && (
      <div>
        <Typography variant="headline">Main info</Typography>
        <FormWithLoader
          onSubmit={this.onSubmit}
          loaderId={CONTENT_LOADER_ID}
          showLoadingOverlay={true}
          citiesMap={this.props.citiesMap}
          typesMap={this.props.typesMap}
          userRole={this.props.userRole}
          usersMap={this.props.usersMap}
          initialValues={this.props.loadedItem}
        />
        <NavigationPrompt when={this.props.showNavigationPrompt} />
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  usersMap: state.users.dataMap,
  citiesMap: state.cities.dataMap,
  typesMap: state.types.dataMap,
  userRole: state.currentUser.details.role,
  showNavigationPrompt: isDirty(MAIN_INFO_FORM_NAME)(state) && !isSubmitting(MAIN_INFO_FORM_NAME)(state),
});

const mapDispatchToProps = (dispatch) => ({
  updateItem: (item) => dispatch(updateMainInfo(item)),
  createItem: (item) => dispatch(postItem(item)),
  initializeForm: (data) => dispatch(initialize(MAIN_INFO_FORM_NAME, data)),
});

export const MainInfoPage = connect<any, any, {}>(mapStateToProps, mapDispatchToProps)(MainInfoPageComponent);
