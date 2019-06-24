import Loadable from 'react-loadable';
import { Loading } from 'components/loading';

export const AdminLayoutPage = Loadable({
  loader: () => import(/* webpackChunkName: "adminLayoutPage" */ './layout'),
  loading: Loading
});
