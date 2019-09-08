import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';
import { CSSProperties } from 'react';

export const styles = (theme: Theme) => {
  const mediaQuery = '@media (min-width: 600px)';

  const getMinHeight = (toolbar: CSSProperties) => `calc(100vh - ${toolbar.minHeight}px)`;
  const { toolbar } = theme.mixins;

  return createStyles({
    wrapper: {
      // position: 'relative',
      // zIndex: -1,
      '& > div': {
        minHeight: getMinHeight(toolbar),
        [mediaQuery]: {
          minHeight: getMinHeight(toolbar[mediaQuery] as CSSProperties)
        }
      }
    }
  });
};
