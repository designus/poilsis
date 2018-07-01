import * as React from 'react';
import { connect } from 'react-redux';
// import { debounce } from 'lodash';
import { updateMainInfo, postItem } from '../../../../actions';
// import { extendWithForm } from '../../../../components';
import {
  // getFormStateWithData,
  getInitialFormState,
  getBackendErrors,
  // CONTENT_LOADER_ID,
  TGenericFormModel,
  IGenericFormState,
  getKeyMap,
  required,
  minLength,
  maxLength,
  adminRoutes,
} from '../../../../client-utils';
// import { Form } from './form';
import Form from './form/form2';
import {
  ID_LABEL,
  NAME_LABEL,
  CITY_LABEL,
  TYPES_LABEL,
  ADDRESS_LABEL,
  MAIN_INFO,
  USER_LABEL,
} from '../../../../../../data-strings';
import { IMainInfoFields } from '../../../../../../global-utils';
import Typography from '@material-ui/core/Typography';
import { IAppState } from '../../../../reducers';
// import { Field, reduxForm } from 'redux-form';

export type TMainInfoModel = TGenericFormModel<IMainInfoFields>;

export const mainInfoModel: TMainInfoModel = {
  id: getKeyMap('', ID_LABEL, []),
  name: getKeyMap('', NAME_LABEL, [required]),
  city: getKeyMap('', CITY_LABEL, [required]),
  types: getKeyMap([], TYPES_LABEL, [required, minLength(1, true), maxLength(3, true)]),
  address: getKeyMap('', ADDRESS_LABEL, [required]),
  userId: getKeyMap('', USER_LABEL, []),
};

// const MainInfoForm = extendWithForm(Form);

class MainInfoPageComponent extends React.Component<any, any> {

  state: IGenericFormState<IMainInfoFields> = getInitialFormState(mainInfoModel);
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
    // console.log('Loaded item', this.props.loadedItem);
    // const initialState = this.props.loadedItem && this.props.loadedItem.isFullyLoaded
    //   ? getFormStateWithData(this.props.loadedItem, this.state)
    //   : this.state;

    return (this.props.loadedItem || this.isCreatePage) && (
      <div>
        <Typography variant="headline">{MAIN_INFO}</Typography>
        <Form
          handleSubmit={this.onItemSubmit}
          citiesMap={this.props.citiesMap}
          typesMap={this.props.typesMap}
          userRole={this.props.userRole}
          usersMap={this.props.usersMap}
          initialValues={this.props.loadedItem}
        />
        {/* <MainInfoForm
          loaderId={CONTENT_LOADER_ID}
          showLoadingOverlay={true}
          onItemSubmit={this.onItemSubmit}
          initialState={initialState}
          userRole={this.props.userRole}
          citiesMap={this.props.citiesMap}
          typesMap={this.props.typesMap}
          usersMap={this.props.usersMap}
          isCreate={this.isCreatePage}
        /> */}
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
