import { withStyles } from '@material-ui/core/styles';
import { styles} from 'components/menu/adminLeftMenu/styles';
import Menu, { IMenuProps } from 'components/menu/menu';

// @ts-ignore
export const VerticalMenu = withStyles(styles as any)(Menu) as React.FunctionComponent<IMenuProps>;
