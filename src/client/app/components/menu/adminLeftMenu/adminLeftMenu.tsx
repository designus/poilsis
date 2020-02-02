import { withStyles } from '@material-ui/core/styles';
import { styles} from './styles';
import Menu, { IMenuProps } from 'components/menu/menu';

// @ts-ignore
export const AdminLeftMenu = withStyles(styles as any)(Menu) as any;
