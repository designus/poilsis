import Loadable from 'react-loadable';
import { Loading } from 'components';

export const AdminLayoutPage = Loadable({
  loader: () => import(/* webpackChunkName: "adminLayoutPage" */ './layout'),
  loading: Loading,
});
