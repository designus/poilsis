import * as React from 'react';
import { injectIntl, WrappedComponentProps as InjectedIntlProps } from 'react-intl';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { DataTypes, Locale } from 'global-utils/typings';
import { TranslatableField, IsEnabled } from 'data-models';
import { LANGUAGES } from 'global-utils/constants';
import { ToggleEnabledParams } from 'types';

import { ToggleAction } from '../toggleAction';

import { styles } from './styles';

interface IToggleEnabledProps extends WithStyles<typeof styles>, InjectedIntlProps {
  item: DataTypes;
  onToggle: (params: ToggleEnabledParams) => void;
}

function ToggleEnabled(props: IToggleEnabledProps) {
  const handleToggle = (id: string, isEnabled: boolean, locale: Locale) => () => {
    props.onToggle({ id, isEnabled, locale });
  };

  return (
    <div className={props.classes.isEnabledWrapper}>
      {LANGUAGES.map(lang => {
        const itemName = props.item.name as TranslatableField;
        const isEnabled = props.item.isEnabled as IsEnabled;
        const isDisabled = !itemName[lang];
        return props.item.isEnabled && (
          <ToggleAction
            isDisabled={isDisabled}
            showTooltip={isDisabled}
            tooltipText={props.intl.formatMessage({ id: 'admin.items.toggle_tooltip_message'}, { language: lang })}
            label={lang}
            key={lang}
            isEnabled={isEnabled[lang]}
            onToggle={handleToggle(props.item.id, !isEnabled[lang], lang)}
          />
        );
      })}
    </div>
  );
}

export default injectIntl(
  withStyles(styles)(ToggleEnabled)
);
