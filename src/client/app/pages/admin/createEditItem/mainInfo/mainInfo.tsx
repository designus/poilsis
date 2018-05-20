import * as React from 'react';
import { connect } from 'react-redux';
import { updateMainInfo, postItem } from '../../../../actions';
import { extendWithForm } from '../../../../components';
import {
  getFormStateWithData,
  getInitialFormState,
  getBackendErrors,
  CONTENT_LOADER_ID,
  TGenericFormModel,
  IGenericFormState,
  getKeyMap,
  required,
  minLength,
  maxLength,
} from '../../../../client-utils';
import { Form } from './form';
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
import { adminRoutes } from '../../../../client-utils';
import Typography from 'material-ui/Typography';
import { IAppState } from '../../../../reducers';

export type TMainInfoModel = TGenericFormModel<IMainInfoFields>;

export const mainInfoModel: TMainInfoModel = {
  id: getKeyMap('', ID_LABEL, []),
  name: getKeyMap('', NAME_LABEL, [required]),
  city: getKeyMap('', CITY_LABEL, [required]),
  types: getKeyMap([], TYPES_LABEL, [required, minLength(1, true), maxLength(3, true)]),
  address: getKeyMap('', ADDRESS_LABEL, [required]),
  userId: getKeyMap('', USER_LABEL, []),
};

const MainInfoForm = extendWithForm(Form);

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
    const initialState = this.props.loadedItem && this.props.loadedItem.isFullyLoaded
      ? getFormStateWithData(this.props.loadedItem, this.state)
      : this.state;

    if (this.props.loadedItem || this.isCreatePage) {

      return (
        <div>
          <Typography type="headline">{MAIN_INFO}</Typography>
          <MainInfoForm
            loaderId={CONTENT_LOADER_ID}
            showLoadingOverlay={true}
            onItemSubmit={this.onItemSubmit}
            initialState={initialState}
            citiesMap={this.props.citiesMap}
            typesMap={this.props.typesMap}
            usersMap={this.props.usersMap}
            isCreate={this.isCreatePage}
          />
        </div>
      );
    } else {
      return null;
    }
  }
};

const mapStateToProps = (state: IAppState) => {
  return {
    usersMap: state.users.dataMap,
    citiesMap: state.cities.dataMap,
    typesMap: state.types.dataMap,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMainInfo: (item) => dispatch(updateMainInfo(item)),
    postItem: (item) => dispatch(postItem(item)),
  };
};

export const MainInfoPage = connect<any, any, {}>(mapStateToProps, mapDispatchToProps)(MainInfoPageComponent);
