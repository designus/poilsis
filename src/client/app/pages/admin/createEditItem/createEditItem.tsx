import * as React from 'react';
import { connect } from 'react-redux';
import HomeIcon from 'material-ui-icons/Home';
import PhotoIcon from 'material-ui-icons/Photo';
import BackIcon from 'material-ui-icons/ArrowBack';

import { IAppState } from '../../../reducers';
import { getItem } from '../../../actions';
import { IAdminMenuItem } from '../../../components';
import { ITEM_LOADER_ID, adminRoutes } from '../../../client-utils';
import { MAIN_INFO, PHOTO_GALLERY, GO_BACK } from '../../../../../data-strings';

export const CREATE_EDIT_ITEM_LOADER = 'createEditItem';

class CreateEditItemPageComponent extends React.Component<any, any> {

  isCreatePage = !Boolean(this.props.params.id);

  constructor(props) {
    super(props);
  }

  getMenuItems(id?: string): IAdminMenuItem[] {
    return [
      {
        icon: () => (<HomeIcon />),
        link: id ? adminRoutes.editItemMain.getLink(id) : adminRoutes.createItemMain.getLink(),
        text: MAIN_INFO,
      },
      {
        icon: () => (<PhotoIcon />),
        link: adminRoutes.editItemPhotos.getLink(id),
        text: PHOTO_GALLERY,
        isDisabled: this.isCreatePage,
      },
      {
        icon: () => (<BackIcon />),
        link: adminRoutes.items.getLink(),
        text: GO_BACK,
      },
    ];
  }

  componentDidMount() {
    this.props.setMenuItems(this.getMenuItems(this.props.params.id));
    if (!this.isCreatePage) {
      this.props.getItem(this.props.params.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.isCreatePage = !Boolean(nextProps.params.id);
    this.props.setMenuItems(this.getMenuItems(nextProps.params.id));
  }

  render() {

    const loadedItem = this.props.itemsMap[this.props.params.id];
    const { itemsMap, citiesMap, typesMap, children } = this.props;

    if (loadedItem || this.isCreatePage) {
      return (
        <div>
          {React.cloneElement(children, {loadedItem, itemsMap, citiesMap, typesMap})}
        </div>
      );
    } else {
      return null;
    }
  }
};

const mapStateToProps = (state: IAppState) => {
  return {
    itemsMap: state.items.dataMap,
    citiesMap: state.cities.dataMap,
    typesMap: state.types.dataMap,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getItem: (itemId) => dispatch(getItem(itemId, ITEM_LOADER_ID)),
  };
};

export const CreateEditItemPage = connect(mapStateToProps, mapDispatchToProps)(CreateEditItemPageComponent);
