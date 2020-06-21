import { AxiosResponse } from 'axios';
import { IntlShape } from 'react-intl';
import { http } from 'actions/utils';
import { TranslatedMessages } from 'types';
import { MainInfoInput } from 'global-utils/input-types';
import { Type, City } from 'global-utils/data-models';
import { DataTypes } from 'global-utils/typings';

const messages: TranslatedMessages = {
  aliasExist: {
    id: 'common.form_validation.duplicated_alias',
    description: 'This alias already exist'
  }
};

export const asyncValidateAlias = (
  item: MainInfoInput | Type | City,
  url: string,
  intl: IntlShape,
  id?: string
): Promise<boolean | undefined> => {
  const { name, alias } = item;
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
