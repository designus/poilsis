import Loadable from 'react-loadable';
import { Loading } from 'components/loading';

export const PhotosPage = Loadable({
  loader: () => import(/* webpackChunkName: "photosPage" */ './photos'),
  loading: Loading,
});
