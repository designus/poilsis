import * as React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { SubmissionError, isDirty, submit } from 'redux-form';
import { IAppState } from 'reducers';
import { updateMainInfo, postItem } from 'actions';
import { getBackendErrors, adminRoutes, CONTENT_LOADER_ID } from 'client-utils';
import { extendWithLoader, NavigationPrompt, SaveModal } from 'components';
import { MainInfoForm } from './form';

const FormWithLoader = extendWithLoader(MainInfoForm);

class MainInfoPageComponent extends React.Component<any, any> {

  constructor(props) {
    super(props);
  }

  handleErrors(errors) {
    throw new SubmissionError(getBackendErrors(errors));
  }

  onSubmit = (item) => {
    const { isCreatePage, postItem, history, updateMainInfo } = this.props;
    if (isCreatePage) {
      return postItem(item)
        .then(({userId, itemId}) => history.push(adminRoutes.editItemMain.getLink(userId, itemId)))
        .catch(this.handleErrors);
    }
    return updateMainInfo(item).catch(this.handleErrors);
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
        <NavigationPrompt when={this.props.isFormDirty}>
          {(isOpen, onConfirm, onCancel) => (
            <SaveModal
              isModalOpen={isOpen}
              onConfirm={onConfirm}
              onCancel={onCancel}
            />
          )}
        </NavigationPrompt>
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
    remoteSubmit: () => dispatch(submit('MainInfoForm')),
  };
};

export const MainInfoPage = connect<any, any, {}>(mapStateToProps, mapDispatchToProps)(MainInfoPageComponent);
