import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { DataTypes } from 'global-utils/typings';
import { LANGUAGES } from 'global-utils/constants';

import { ToggleAction } from '../toggleAction';

import { styles } from './styles';

interface IAdminItemToggleProps extends WithStyles<typeof styles>, InjectedIntlProps {
  item: DataTypes;
  onToggle: (id: string, isEnabled: boolean, lang: string) => () => void;
}

function AdminItemToggle(props: IAdminItemToggleProps) {
  return (
    <div className={props.classes.isEnabledWrapper}>
      {LANGUAGES.map(lang => {
        const isDisabled = !props.item.name[lang];
        return (
          <ToggleAction
            isDisabled={isDisabled}
            showTooltip={isDisabled}
            tooltipText={props.intl.formatMessage({ id: 'admin.items.toggle_tooltip_message'}, { language: lang })}
            label={lang}
            key={lang}
            isEnabled={props.item.isEnabled[lang]}
            onToggle={props.onToggle(props.item.id, !props.item.isEnabled[lang], lang)}
          />
        );
      })}
    </div>
  );
}

export default injectIntl(
  withStyles(styles)(AdminItemToggle)
);
