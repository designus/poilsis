import { IAppState } from 'reducers';
import { getAccessTokenClaims } from 'global-utils/methods';

export const isLoggedIn = (state: IAppState) => state.auth.isLoggedIn;

export const getAccessToken = (state: IAppState) => state.auth.accessToken;

export const getSessionExpiryTime = (state: IAppState) => {
  const accessToken = getAccessToken(state);
  return accessToken ? getAccessTokenClaims(accessToken).expires : null;
};
