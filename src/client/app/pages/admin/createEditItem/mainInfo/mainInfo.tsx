import * as React from 'react';
import { connect } from 'react-redux';
import { updateMainInfo, postItem } from '../../../../actions';
import {
  getBackendErrors,
  adminRoutes,
} from '../../../../client-utils';
import { MainInfoForm } from './form';
import { IMainInfoFields } from '../../../../../../global-utils';
import Typography from '@material-ui/core/Typography';
import { IAppState } from '../../../../reducers';

class MainInfoPageComponent extends React.Component<any, any> {

  isCreatePage = !Boolean(this.props.match.params.id);

  constructor(props) {
    super(props);
  }

  handleErrors(errors) {
    const newErrors = {...this.state.errors, ...getBackendErrors(errors)};
    this.setState({errors: newErrors, showErrors: true});
  }

  onItemSubmit = (item: IMainInfoFields) => {
    if (this.isCreatePage) {
      this.props.postItem(item)
        .then(id => this.props.history.push(adminRoutes.editItemMain.getLink(id)))
        .catch(this.handleErrors);
    } else {
      this.props.updateMainInfo(item).catch(this.handleErrors);
    }
  }

  render() {
    return (this.props.loadedItem || this.isCreatePage) && (
      <div>
        <Typography variant="headline">Main info</Typography>
        <MainInfoForm
          handleSubmit={this.onItemSubmit}
          citiesMap={this.props.citiesMap}
          typesMap={this.props.typesMap}
          userRole={this.props.userRole}
          usersMap={this.props.usersMap}
          initialValues={this.props.loadedItem}
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
