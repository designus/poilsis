import * as React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { SubmissionError, isDirty, initialize } from 'redux-form';
import { IAppState } from 'reducers';
import { updateMainInfo, postItem } from 'actions';
import { getBackendErrors, adminRoutes, CONTENT_LOADER_ID } from 'client-utils';
import { IItemFields } from 'global-utils';
import { extendWithLoader, NavigationPrompt } from 'components';
import { MainInfoForm } from './form';

const FormWithLoader = extendWithLoader(MainInfoForm);

class MainInfoPageComponent extends React.Component<any, any> {

  constructor(props) {
    super(props);
  }

  handleErrors(errors) {
    throw new SubmissionError(getBackendErrors(errors));
  }

  onSubmit = (item: IItemFields) => {
    const { isCreatePage, postItem, history, updateMainInfo, initializeForm } = this.props;
    const submitFn = isCreatePage ? postItem : updateMainInfo;

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
          loaderId={CONTENT_LOADER_ID}
          onSubmit={this.onSubmit}
          showLoadingOverlay={true}
          citiesMap={this.props.citiesMap}
          typesMap={this.props.typesMap}
          userRole={this.props.userRole}
          usersMap={this.props.usersMap}
          initialValues={this.props.loadedItem}
        />
        <NavigationPrompt when={this.props.isFormDirty} />
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  usersMap: state.users.dataMap,
  citiesMap: state.cities.dataMap,
  typesMap: state.types.dataMap,
  userRole: state.currentUser.details.role,
  isFormDirty: isDirty('MainInfoForm')(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    updateMainInfo: (item) => dispatch(updateMainInfo(item)),
    postItem: (item) => dispatch(postItem(item)),
    initializeForm: (data) => dispatch(initialize('MainInfoForm', data)),
  };
};

export const MainInfoPage = connect<any, any, {}>(mapStateToProps, mapDispatchToProps)(MainInfoPageComponent);
