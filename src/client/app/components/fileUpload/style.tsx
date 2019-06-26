import { UPLOADED_PHOTO_HEIGHT } from 'global-styles';

import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  imageUpload: {
    margin: '10px 0',
    '& .dropzone': {
      padding: '15px',
      margin: '20px 0 10px',
      border: '2px dashed #dbdbdb',
      background: '#efefef',
      textAlign: 'center',
      cursor: 'pointer',
      minHeight: `${UPLOADED_PHOTO_HEIGHT}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  },
  uploadPlaceholder: {
    width: '100%',
    margin: '10px 0'
  },
  uploadButtons: {
    margin: '10px 0'
  }
});
