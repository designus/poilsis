import Loadable from 'react-loadable';
import { Loading } from 'components';

export const ClientLayoutPage = Loadable({
  loader: () => import(/* webpackChunkName: "clientLayout" */ './layout'),
  loading: Loading,
});
