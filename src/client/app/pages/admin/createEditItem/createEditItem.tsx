import * as React from 'react';
import { connect } from 'react-redux';
import HomeIcon from '@material-ui/icons/Home';
import PhotoIcon from '@material-ui/icons/Photo';
import { Switch, RouteComponentProps } from 'react-router-dom';

import { IAppState, IItem, IItemsMap } from 'reducers';
import { getItem } from 'actions';
import { IAdminMenuItem, NotFound, PropsRoute, HorizontalMenu, ProtectedRoute } from 'components';
import { adminRoutes } from 'client-utils';
import { MAIN_INFO, PHOTO_GALLERY } from 'data-strings';
import { MainInfoPage, PhotosPage } from 'pages';

interface IMatchParams {
  itemId: string;
  userId: string;
}
interface ICreateEditItemPageProps extends RouteComponentProps<IMatchParams> {
  itemsMap: IItemsMap;
  getItem: (id) => void;
}

class CreateEditItemPageComponent extends React.Component<ICreateEditItemPageProps, any> {

  isCreatePage = !Boolean(this.props.match.params.itemId);

  constructor(props) {
    super(props);
  }

  static fetchData(store, params) {
    if (params.id) {
      return store.dispatch(getItem(params.itemId));
    } else {
      return Promise.resolve(null);
    }
  }

  getLoadedItem(): IItem {
    return this.props.itemsMap[this.props.match.params.itemId];
  }

  getMenuItems(userId?: string, itemId?: string): IAdminMenuItem[] {
    return [
      {
        icon: () => (<HomeIcon />),
        link: userId ? adminRoutes.editItemMain.getLink(userId, itemId) : adminRoutes.createItemMain.getLink(),
        text: MAIN_INFO,
      },
      {
        icon: () => (<PhotoIcon />),
        link: adminRoutes.editItemPhotos.getLink(userId, itemId),
        text: PHOTO_GALLERY,
        isDisabled: this.isCreatePage,
      },
    ];
  }

  componentDidMount() {
    const loadedItem = this.getLoadedItem();
    if (!this.isCreatePage && (!loadedItem || !loadedItem.isFullyLoaded)) {
      this.props.getItem(this.props.match.params.itemId);
    }
  }

  render() {
    const loadedItem = this.getLoadedItem();
    const childProps = {...this.props, loadedItem, isCreatePage: this.isCreatePage };
    const { userId, itemId } = this.props.match.params;

    return (loadedItem || this.isCreatePage) && (
      <div>
        <HorizontalMenu items={this.getMenuItems(userId, itemId)} />
        <Switch>
          <ProtectedRoute
            path={adminRoutes.createItem.path}
            exact
            component={MainInfoPage}
            {...childProps}
          />
          <ProtectedRoute
            path={adminRoutes.editItemPhotos.path}
            component={PhotosPage}
            {...childProps}
          />
          <ProtectedRoute
            path={adminRoutes.editItemMain.path}
            component={MainInfoPage}
            {...childProps}
          />
          <PropsRoute component={NotFound}/>
        </Switch>
      </div>
    );
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
