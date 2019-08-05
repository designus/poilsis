import { withStyles } from '@material-ui/core/styles';
import { styles} from './styles';
import Menu, { IMenuProps } from 'components/menu/menu';

export const AdminLeftMenu = withStyles(styles)(Menu) as React.ComponentType<IMenuProps>;
