import Loadable from 'react-loadable';
import { Loading } from 'components';

export const AdminItemsPage = Loadable({
  loader: () => import(/* webpackChunkName: "adminItemsPage" */ './items'),
  loading: Loading,
});
