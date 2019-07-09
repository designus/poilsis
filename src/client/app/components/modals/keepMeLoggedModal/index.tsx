import Loadable from 'react-loadable';
import { Loading } from 'components/loading';

export const KeepMeLoggedModal = Loadable({
  loader: () => import(/* webpackChunkName: "keepMeLoggedModal" */ './keepMeLoggedModal'),
  loading: Loading
});
