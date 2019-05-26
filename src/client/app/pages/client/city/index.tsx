import Loadable from 'react-loadable';
import { Loading } from 'components';

export const CityPage = Loadable({
  loader: () => import(/* webpackChunkName: "clientCity" */ './city'),
  loading: Loading,
});
