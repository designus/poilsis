import * as React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { SubmissionError } from 'redux-form';
import { IAppState } from 'reducers';
import { updateMainInfo, postItem } from 'actions';
import {
  getBackendErrors,
  adminRoutes,
} from 'client-utils';
import MainInfoForm from './form/form';

class MainInfoPageComponent extends React.Component<any, any> {

  constructor(props) {
    super(props);
  }

  handleErrors(errors) {
    throw new SubmissionError(getBackendErrors(errors));
  }

  onSubmit = (item) => {
    if (this.props.isCreatePage) {
      return this.props.postItem(item)
        .then(({userId, itemId}) => {
          this.props.history.push(adminRoutes.editItemMain.getLink(userId, itemId));
        })
        .catch(this.handleErrors);
    } else {
      return this.props.updateMainInfo(item).catch(this.handleErrors);
    }
  }

  render() {
    return (this.props.loadedItem || this.props.isCreatePage) && (
      <div>
        <Typography variant="headline">Main info</Typography>
        <MainInfoForm
          onSubmit={this.onSubmit}
          citiesMap={this.props.citiesMap}
          typesMap={this.props.typesMap}
          userRole={this.props.userRole}
          usersMap={this.props.usersMap}
          initialValues={this.props.loadedItem}
          handleErrors={this.handleErrors}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    usersMap: state.users.dataMap,
    citiesMap: state.cities.dataMap,
    typesMap: state.types.dataMap,
    userRole: state.currentUser.details.role,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMainInfo: (item) => dispatch(updateMainInfo(item)),
    postItem: (item) => dispatch(postItem(item)),
  };
};

export const MainInfoPage = connect<any, any, {}>(mapStateToProps, mapDispatchToProps)(MainInfoPageComponent);
