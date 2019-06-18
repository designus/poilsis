import Loadable from 'react-loadable';
import { Loading } from 'components';

export const MainInfoPage = Loadable({
  loader: () => import(/* webpackChunkName: "mainInfoPage" */ './mainInfo'),
  loading: Loading,
});
