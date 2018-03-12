import { startLoading, endLoading, showToast } from '../actions';
import { Toast } from '../reducers';
import { DIALOG_LOADER_ID } from '../client-utils';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export const loginSuccess = (user) => ({type: LOGIN_SUCCESS, user});
export const logoutSuccess = () => ({type: LOGOUT_SUCCESS});

export const login = (credentials = {username: 'admin', password: 'admin'}) => dispatch => {
  dispatch(startLoading(DIALOG_LOADER_ID));

  const mockedUser = {
    name: 'Martynas',
    role: 'admin',
  };

  setTimeout(() => {
    dispatch(loginSuccess(mockedUser));
    dispatch(endLoading(DIALOG_LOADER_ID));
    dispatch(showToast(Toast.success, 'User logged in successfully'));
  }, 500);
};

export const logout = () => dispatch => {
  dispatch(logoutSuccess());
};
