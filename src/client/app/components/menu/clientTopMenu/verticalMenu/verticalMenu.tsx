import { withStyles } from '@material-ui/core/styles';
import { styles} from 'components/menu/adminLeftMenu/styles';
import Menu, { IMenuProps } from 'components/menu/menu';

export const VerticalMenu = withStyles(styles)(Menu) as React.ComponentType<IMenuProps>;
