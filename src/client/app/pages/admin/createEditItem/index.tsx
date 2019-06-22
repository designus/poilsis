import Loadable from 'react-loadable';
import { Loading } from 'components/loading';

export const CreateEditItemPage = Loadable({
  loader: () => import(/* webpackChunkName: "createEditItemPage" */ './createEditItem'),
  loading: Loading,
});
