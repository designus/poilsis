import * as React from 'react';
import { connect } from 'react-redux';
import HomeIcon from '@material-ui/icons/Home';
import PhotoIcon from '@material-ui/icons/Photo';
import DescriptionIcon from '@material-ui/icons/Description';
import { Switch, RouteComponentProps } from 'react-router-dom';
import { isEqual } from 'lodash';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { IAppState } from 'reducers';
import { getAdminItem } from 'actions';
import { TItemFields } from 'global-utils';
import { IAdminMenuItem, NotFound, PropsRoute, HorizontalMenu, ProtectedRoute, Loader } from 'components';
import { adminRoutes } from 'client-utils';
import { shouldLoadEditItem } from 'selectors';
import { MainInfoPage } from './mainInfo';
import { PhotosPage } from './photos';
import { DescriptionPage } from './description';

interface IMatchParams {
  itemId: string;
  userId: string;
}
export interface ICreateEditItemPageProps extends RouteComponentProps<IMatchParams>, InjectedIntlProps {
  loadedItem: TItemFields;
  shouldLoadEditItem: boolean;
  loadAdminItem: (itemId: string) => Promise<void>;
}

class CreateEditItemPage extends React.Component<ICreateEditItemPageProps, any> {

  constructor(props) {
    super(props);
  }

  static fetchData(store, params: IMatchParams) {
    if (params.itemId) {
      return store.dispatch(getAdminItem(params.itemId));
    } else {
      return Promise.resolve(null);
    }
  }

  isCreatePage = () => !Boolean(this.props.match.params.itemId);

  getMenuItems(userId?: string, itemId?: string): IAdminMenuItem[] {
    const { formatMessage } = this.props.intl;
    return [
      {
        icon: () => (<HomeIcon />),
        link: userId ? adminRoutes.editItemMain.getLink(userId, itemId) : adminRoutes.createItemMain.getLink(),
        text: formatMessage({ id: 'admin.menu.main_info' }),
      },
      {
        icon: () => (<DescriptionIcon />),
        link: adminRoutes.editItemDescription.getLink(userId, itemId),
        text: formatMessage({ id: 'admin.menu.description' }),
        isDisabled: this.isCreatePage(),
      },
      {
        icon: () => (<PhotoIcon />),
        link: adminRoutes.editItemPhotos.getLink(userId, itemId),
        text: formatMessage({ id: 'admin.menu.photo_gallery' }),
        isDisabled: this.isCreatePage(),
      },
    ];
  }

  componentDidMount() {
    if (!this.isCreatePage() && this.props.shouldLoadEditItem) {
      this.props.loadAdminItem(this.props.match.params.itemId);
    }
  }

  componentDidUpdate(props: ICreateEditItemPageProps) {
    const { match, loadAdminItem, shouldLoadEditItem } = this.props;
    // When we navigate from create page to update we need to load updated city
    if (!isEqual(props.match.params, match.params) || shouldLoadEditItem) {
      loadAdminItem(match.params.itemId);
    }
  }

  render() {
    const { loadedItem, match } = this.props;
    const isCreatePage = this.isCreatePage();
    const childProps = { loadedItem, isCreatePage };
    const { userId, itemId } = match.params;

    return (loadedItem || isCreatePage) && (
      <React.Fragment>
        <HorizontalMenu items={this.getMenuItems(userId, itemId)} />
        <Switch>
          <ProtectedRoute
            path={adminRoutes.createItem.path}
            exact
            component={MainInfoPage}
            {...childProps}
          />
          <ProtectedRoute
            path={adminRoutes.editItemMain.path}
            component={MainInfoPage}
            {...childProps}
          />
          <ProtectedRoute
            path={adminRoutes.editItemDescription.path}
            component={DescriptionPage}
            {...childProps}
          />
          <ProtectedRoute
            path={adminRoutes.editItemPhotos.path}
            component={PhotosPage}
            {...childProps}
          />
          <PropsRoute component={NotFound}/>
        </Switch>
      </React.Fragment>
    ) || <Loader isLoading />;
  }
}

const mapStateToProps = (state: IAppState, props: ICreateEditItemPageProps) => ({
  loadedItem: state.admin.items[props.match.params.itemId],
  shouldLoadEditItem: shouldLoadEditItem(state, props.match.params.itemId),
});

const mapDispatchToProps = (dispatch) => ({
  loadAdminItem: (itemId: string) => dispatch(getAdminItem(itemId)),
});

export default injectIntl(
  connect<{}, {}, ICreateEditItemPageProps>(mapStateToProps, mapDispatchToProps)(CreateEditItemPage),
);
