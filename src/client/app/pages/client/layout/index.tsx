import Loadable from 'react-loadable';
import { Loading } from 'components/loading';

export const ClientLayoutPage = Loadable({
  loader: () => import(/* webpackChunkName: "clientLayout" */ './layout'),
  loading: Loading,
});
