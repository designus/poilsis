import { AxiosResponse } from 'axios';
import { InjectedIntl } from 'react-intl';
import { http } from 'actions/utils';
import { AppTypes, TranslatedMessages } from 'types';

const messages: TranslatedMessages = {
  aliasExist: {
    id: 'common.form_validation.duplicated_alias',
    description: 'This alias already exist'
  }
};

export const asyncValidateAlias = (item: AppTypes, url: string, intl: InjectedIntl): Promise<boolean> => {
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
