import Loadable from 'react-loadable';
import { Loading } from 'components/loading';

export const CityPage = Loadable({
  loader: () => import(/* webpackChunkName: "clientCity" */ './city'),
  loading: Loading
});
