import Loadable from 'react-loadable';
import { Loading } from 'components/loading';

export const DescriptionPage = Loadable({
  loader: () => import(/* webpackChunkName: "descriptionPage" */ './description'),
  loading: Loading
});
