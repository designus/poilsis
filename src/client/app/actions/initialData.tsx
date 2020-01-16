import { AxiosResponse } from 'axios';
import { getNormalizedData, setAcceptLanguageHeader } from 'client-utils/methods';
import { setClientLocale } from 'actions/locale';
import { receiveUserDetails } from 'actions/currentUser';
import { getAccessTokenClaims, DEFAULT_LANGUAGE, ICity, IType, IUser, Languages } from 'global-utils';
import {
  InitialDataActionTypes,
  IInitialData,
  IClearAllData,
  IReceiveInitialData,
  ThunkResult
} from 'types';
import { getClientLocale } from 'selectors';
import { http } from './utils';

export interface IGetInitialDataParams {
  pathName?: string;
  locale?: Languages;
}

export const receiveInitialData = (data: IInitialData): IReceiveInitialData => ({
  type: InitialDataActionTypes.RECEIVE_INITIAL_DATA,
  data
});

export const clearAllData = (): IClearAllData => ({
  type: InitialDataActionTypes.CLEAR_ALL_DATA
});

export const getInitialData = (params: IGetInitialDataParams): ThunkResult<Promise<void>> => {
  return (dispatch, getState) => {
    const state = getState();
    const locale = params.locale || getClientLocale(state) || DEFAULT_LANGUAGE;
    const token = state.auth.accessToken;
    const accessTokenClaims = token ? getAccessTokenClaims(token) : null;

    if (locale !== getClientLocale(state)) {
      dispatch(setClientLocale({ locale }));
    }

    const promises = [
      http.get('/api/cities', setAcceptLanguageHeader(locale)),
      http.get('/api/types', setAcceptLanguageHeader(locale))
    ];

    return Promise.all(promises)
      .then((response: [AxiosResponse<ICity[]>, AxiosResponse<IType[]>]) => {
        const [citiesResponse, typesResponse] = response;
        const cities = getNormalizedData(citiesResponse.data);
        const types = getNormalizedData(typesResponse.data);

        dispatch(receiveInitialData({cities, types }));

        if (accessTokenClaims) {
          const { userId: id, userName: name, userRole: role } = accessTokenClaims;
          dispatch(receiveUserDetails({ userDetails: { id, name, role } }));
        }
      })
      .catch(console.error);
  };
};
