import Loadable from 'react-loadable';
import { Loading } from 'components/loading';

export const HomePage = Loadable({
  loader: () => import(/* webpackChunkName: "homePage" */ './home'),
  loading: Loading
});
