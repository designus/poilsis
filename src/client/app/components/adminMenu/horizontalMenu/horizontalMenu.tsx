import { withStyles } from '@material-ui/core/styles';
import { styles} from './styles';
import AdminMenu, { IAdminMenuProps } from '../adminMenu';

export const HorizontalMenu = withStyles(styles)(AdminMenu) as React.ComponentType<IAdminMenuProps>;
