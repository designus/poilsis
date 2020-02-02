import { AxiosResponse } from 'axios';
import { IntlShape } from 'react-intl';
import { http } from 'actions/utils';
import { TranslatedMessages } from 'types';
import { DataTypes } from 'global-utils/typings';

const messages: TranslatedMessages = {
  aliasExist: {
    id: 'common.form_validation.duplicated_alias',
    description: 'This alias already exist'
  }
};

export const asyncValidateAlias = (item: DataTypes, url: string, intl: IntlShape): Promise<boolean | undefined> => {
  const { id, name, alias } = item;
  return http.post(url, { id, name, alias })
    .then((response: AxiosResponse<boolean>) => response.data)
    .then(doesExist => {
      if (doesExist) {
        throw {
          alias: intl.formatMessage(messages.aliasExist)
        };
      }
      return undefined;
    });
};
