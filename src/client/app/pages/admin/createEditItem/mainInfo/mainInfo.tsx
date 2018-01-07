import * as React from 'react';
import { connect } from 'react-redux';
import { updateMainInfo, postItem } from '../../../../actions';
import { extendWithForm } from '../../../../components';
import {
  getFormStateWithData,
  getInitialFormState,
  getBackendErrors,
  ITEM_LOADER_ID,
  voidFn,
  TGenericFormModel,
  IGenericFormState,
  getKeyMap,
  required,
  minLength,
  maxLength,
} from '../../../../client-utils';
import { Form } from './form';
import { CREATE_EDIT_ITEM_LOADER } from '../createEditItem';
import { ID_LABEL, NAME_LABEL, CITY_LABEL, TYPES_LABEL, ADDRESS_LABEL, MAIN_INFO } from '../../../../../../data-strings';
import { IMainInfoFields } from '../../../../../../global-utils';
import { adminRoutes } from '../../../../client-utils';
import Typography from 'material-ui/Typography';

export type TMainInfoModel = TGenericFormModel<IMainInfoFields>;

export const mainInfoModel: TMainInfoModel = {
  id: getKeyMap('', ID_LABEL, []),
  name: getKeyMap('', NAME_LABEL, [required]),
  city: getKeyMap('', CITY_LABEL, [required]),
  types: getKeyMap([], TYPES_LABEL, [required, minLength(1, true), maxLength(3, true)]),
  address: getKeyMap('', ADDRESS_LABEL, [required]),
};

const MainInfoForm = extendWithForm(Form);

class MainInfoPageComponent extends React.Component<any, any> {

  state: IGenericFormState<IMainInfoFields> = getInitialFormState(mainInfoModel);
  isCreatePage = !Boolean(this.props.params.id);

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
        .then(id => this.props.router.push(adminRoutes.editItemMain.getLink(id)))
        .catch(this.handleErrors);
    } else {
      this.props.updateMainInfo(item).catch(this.handleErrors);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {

    const finalState = this.props.loadedItem && getFormStateWithData(this.props.loadedItem, this.state) || this.state;

    if (this.props.loadedItem || this.isCreatePage) {

      return (
        <div>
          <Typography type="headline">{MAIN_INFO}</Typography>
          <MainInfoForm
            loaderId={CREATE_EDIT_ITEM_LOADER}
            onItemSubmit={this.onItemSubmit}
            initialState={finalState}
            citiesMap={this.props.citiesMap}
            typesMap={this.props.typesMap}
            isCreate={this.isCreatePage}
          />
        </div>
      );
    } else {
      return null;
    }
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMainInfo: (item) => dispatch(updateMainInfo(item, ITEM_LOADER_ID)),
    postItem: (item) => dispatch(postItem(item, ITEM_LOADER_ID)),
  };
};

export const MainInfoPage = connect(voidFn, mapDispatchToProps)(MainInfoPageComponent);
