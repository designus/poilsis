import * as React from 'react';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
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

  isCreatePage = !Boolean(this.props.match.params.id);

  constructor(props) {
    super(props);
  }

  static fetchData(store, params) {
    if (params.id) {
      return store.dispatch(getItem(params.id, ITEM_LOADER_ID));
    } else {
      return Promise.resolve(null);
    }
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
    this.props.setMenuItems(this.getMenuItems(this.props.match.params.id));
    if (!this.isCreatePage) {
      this.props.getItem(this.props.match.params.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.isCreatePage = !Boolean(nextProps.match.params.id);
    this.props.setMenuItems(this.getMenuItems(nextProps.match.params.id));
  }

  render() {
    const loadedItem = this.props.itemsMap[this.props.match.params.id];
    const { itemsMap, citiesMap, typesMap } = this.props;

    if (loadedItem || this.isCreatePage) {
      return (
        <div>
          {renderRoutes(this.props.route.routes, {loadedItem, itemsMap, citiesMap, typesMap})}
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

export const CreateEditItemPage = connect<{}, {}, any>(mapStateToProps, mapDispatchToProps)(CreateEditItemPageComponent);
