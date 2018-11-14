import * as React from 'react';
import { connect } from 'react-redux';
import HomeIcon from '@material-ui/icons/Home';
import PhotoIcon from '@material-ui/icons/Photo';
import { Switch, RouteComponentProps } from 'react-router-dom';
import { isEqual } from 'lodash';

import { IAppState } from 'reducers';
import { getAdminItem } from 'actions';
import { TItemFields } from 'global-utils';
import { IAdminMenuItem, NotFound, PropsRoute, HorizontalMenu, ProtectedRoute, Loader } from 'components';
import { adminRoutes } from 'client-utils';
import { MAIN_INFO, PHOTO_GALLERY } from 'data-strings';
import { MainInfoPage, PhotosPage } from 'pages';

interface IMatchParams {
  itemId: string;
  userId: string;
}
export interface ICreateEditItemPageProps extends RouteComponentProps<IMatchParams> {
  loadedItem: TItemFields;
  getItem: (itemId: string) => Promise<void>;
}

class CreateEditItemPageComponent extends React.Component<ICreateEditItemPageProps, any> {

  constructor(props) {
    super(props);
  }

  static fetchData(store, params) {
    if (params.id) {
      return store.dispatch(getAdminItem(params.itemId));
    } else {
      return Promise.resolve(null);
    }
  }

  isCreatePage = () => !Boolean(this.props.match.params.itemId);

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
        isDisabled: this.isCreatePage(),
      },
    ];
  }

  componentDidMount() {
    if (!this.isCreatePage() && !this.props.loadedItem) {
      this.props.getItem(this.props.match.params.itemId);
    }
  }

  componentDidUpdate(props: ICreateEditItemPageProps) {
    // When we navigate from create page to update we need to load updated city
    if (!isEqual(props.match.params, this.props.match.params)) {
      this.props.getItem(this.props.match.params.itemId);
    }
  }

  render() {
    const loadedItem = this.props.loadedItem;
    const isCreatePage = this.isCreatePage();
    const childProps = {...this.props, loadedItem, isCreatePage };
    const { userId, itemId } = this.props.match.params;

    return (loadedItem || isCreatePage) && (
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
    ) || <Loader isLoading />;
  }
}

const mapStateToProps = (state: IAppState, props: ICreateEditItemPageProps) => ({
  loadedItem: state.admin.items[props.match.params.itemId],
});

const mapDispatchToProps = (dispatch) => ({
  getItem: (itemId: string) => dispatch(getAdminItem(itemId)),
});

export const CreateEditItemPage = connect<{}, {}, any>(mapStateToProps, mapDispatchToProps)(CreateEditItemPageComponent);
