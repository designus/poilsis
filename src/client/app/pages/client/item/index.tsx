import Loadable from 'react-loadable';
import { Loading } from 'components';

export const ItemPage = Loadable({
  loader: () => import(/* webpackChunkName: "clientItem" */ './item'),
  loading: Loading,
});
