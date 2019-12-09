import Loadable from 'react-loadable';
import { Loading } from 'components/loading';

export const AdminHomePage = Loadable({
  loader: () => import(/* webpackChunkName: "adminHomePage" */ './home'),
  loading: Loading
});
