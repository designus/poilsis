import Loadable from 'react-loadable';
import { Loading } from 'components/loading';

export const ItemPage = Loadable({
  loader: () => import(/* webpackChunkName: "clientItem" */ './item'),
  loading: Loading,
});
