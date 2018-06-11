import * as React from 'react';
import { connect } from 'react-redux';
import HomeIcon from '@material-ui/icons/Home';
import PhotoIcon from '@material-ui/icons/Photo';
import BackIcon from '@material-ui/icons/ArrowBack';

import { IAppState, IItemsMap } from '../../../reducers';
import { getItem } from '../../../actions';
import { IAdminMenuItem, NotFound, PropsRoute } from '../../../components';
import { adminRoutes } from '../../../client-utils';
import { MAIN_INFO, PHOTO_GALLERY, GO_BACK } from '../../../../../data-strings';
import { Switch } from 'react-router-dom';
import { MainInfoPage, PhotosPage } from '../../../pages';

class CreateEditItemPageComponent extends React.Component<any, any> {

  isCreatePage = !Boolean(this.props.match.params.id);

  constructor(props) {
    super(props);
  }

  static fetchData(store, params) {
    if (params.id) {
      return store.dispatch(getItem(params.id));
    } else {
      return Promise.resolve(null);
    }
  }

  getLoadedItem(): IItemsMap {
    return this.props.itemsMap[this.props.match.params.id];
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
    const loadedItem = this.getLoadedItem();
    this.props.setMenuItems(this.getMenuItems(this.props.match.params.id));
    if (!this.isCreatePage && (!loadedItem || !loadedItem.isFullyLoaded)) {
      this.props.getItem(this.props.match.params.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.isCreatePage = !Boolean(nextProps.match.params.id);
    this.props.setMenuItems(this.getMenuItems(nextProps.match.params.id));
  }

  render() {
    const loadedItem = this.getLoadedItem();
    const childProps = {...this.props, loadedItem };

    if (loadedItem || this.isCreatePage) {
      return (
        <div>
          <Switch>
            {/* TODO: User protected route here */}
            <PropsRoute
              path={'/admin/item/create'}
              exact
              component={MainInfoPage}
              {...childProps}
            />
            <PropsRoute
              path={'/admin/item/edit/:id/photos'}
              component={PhotosPage}
              {...childProps}
            />
            <PropsRoute
              path={'/admin/item/edit/:id'}
              component={MainInfoPage}
              {...childProps}
            />
            <PropsRoute component={NotFound}/>
          </Switch>
        </div>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    itemsMap: state.items.dataMap,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getItem: (itemId) => dispatch(getItem(itemId)),
  };
};

export const CreateEditItemPage = connect<{}, {}, any>(mapStateToProps, mapDispatchToProps)(CreateEditItemPageComponent);
