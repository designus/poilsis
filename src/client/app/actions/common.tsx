import { AxiosResponse } from 'axios';
import { http } from 'actions/utils';
import { AppTypes } from 'types';

export const asyncValidateAlias = (url: string) => <T extends AppTypes>(item: T) => {
  const { id, name, alias } = item;
  return http.post(url, { id, name, alias })
    .then((response: AxiosResponse<boolean>) => response.data)
    .then(doesExist => {
      if (doesExist) {
        throw {
          alias: 'This alias already exist'
        };
      }
      return undefined;
    });
}
