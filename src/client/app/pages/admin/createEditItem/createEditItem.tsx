import * as React from 'react';
import { connect } from 'react-redux';
import HomeIcon from '@material-ui/icons/Home';
import PhotoIcon from '@material-ui/icons/Photo';
import DescriptionIcon from '@material-ui/icons/Description';
import { Switch, RouteComponentProps } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { IAppState } from 'types';
import { getItem } from 'actions';
import { IItem, Languages } from 'global-utils';
import { adminRoutes } from 'client-utils/routes';
import { shouldLoadEditItem, getItemById, getAdminLocale } from 'selectors';
import { NotFound } from 'components/notFound';
import { PropsRoute } from 'components/propsRoute';
import { IMenuItem } from 'components/menu';
import { ProtectedRoute } from 'components/protectedRoute';
import { Loader } from 'components/loader';

import { MainInfoPage } from './mainInfo';
import { PhotosPage } from './photos';
import { DescriptionPage } from './description';
import { AdminTopMenu as TopMenu } from 'components/menu/adminTopMenu';

export type ItemPageMatchParams = {
  itemId: string;
  userId: string;
}

export interface ICreateEditItemPageProps extends RouteComponentProps<ItemPageMatchParams>, InjectedIntlProps {
  loadedItem: IItem;
  shouldLoadEditItem: boolean;
  loadAdminItem: (itemId: string) => Promise<void>;
  locale: Languages;
}

class CreateEditItemPage extends React.Component<ICreateEditItemPageProps, any> {

  constructor(props) {
    super(props);
  }

  static fetchData(store, params: ItemPageMatchParams) {
    if (params.itemId) {
      return store.dispatch(getItem(params.itemId));
    } else {
      return Promise.resolve(null);
    }
  }

  isCreatePage = () => !Boolean(this.props.match.params.itemId);

  getMenuItems(userId?: string, itemId?: string): IMenuItem[] {
    const { formatMessage } = this.props.intl;
    return [
      {
        id: 1,
        icon: () => (<HomeIcon />),
        link: userId ? adminRoutes.editItemMain.getLink(userId, itemId) : adminRoutes.createItemMain.getLink(),
        text: formatMessage({ id: 'admin.menu.main_info' })
      },
      {
        id: 2,
        icon: () => (<DescriptionIcon />),
        link: adminRoutes.editItemDescription.getLink(userId, itemId),
        text: formatMessage({ id: 'admin.menu.description' }),
        isDisabled: this.isCreatePage()
      },
      {
        id: 3,
        icon: () => (<PhotoIcon />),
        link: adminRoutes.editItemPhotos.getLink(userId, itemId),
        text: formatMessage({ id: 'admin.menu.photos' }),
        isDisabled: this.isCreatePage()
      }
    ];
  }

  componentDidMount() {
    if (!this.isCreatePage() && this.props.shouldLoadEditItem) {
      this.props.loadAdminItem(this.props.match.params.itemId);
    }
  }

  renderItemName = (loadedItem: IItem) => {
    return loadedItem ?
      ReactDOM.createPortal(
        <span> / {loadedItem.name[this.props.locale]}</span>,
        document.querySelector('.editItemName')
      ) : null;
  }

  render() {
    const { loadedItem, match, locale } = this.props;
    const isCreatePage = this.isCreatePage();
    const childProps = { loadedItem, isCreatePage };
    const { userId, itemId } = match.params;

    return (loadedItem || isCreatePage) && (
      <React.Fragment>
        {this.renderItemName(loadedItem)}
        <TopMenu items={this.getMenuItems(userId, itemId)} />
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
  loadedItem: getItemById(state, props.match.params.itemId),
  shouldLoadEditItem: shouldLoadEditItem(state, props.match.params.itemId),
  locale: getAdminLocale(state)
});

const mapDispatchToProps = (dispatch) => ({
  loadAdminItem: (itemId: string) => dispatch(getItem(itemId))
});

export default injectIntl(
  connect<{}, {}, ICreateEditItemPageProps>(mapStateToProps, mapDispatchToProps)(CreateEditItemPage)
);
