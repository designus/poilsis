import { Router } from 'express';
import { auth, getClientCities, getAdminCities, addNewCity, updateCity, deleteCity, getCity, doesAliasExist, toggleEnabled } from '../controllers';

import { CitiesModel } from '../model';

const router = Router();

router.route('/')
  .post(auth.authenticate(), auth.authorize(['admin']), addNewCity);

router.route('/admin-cities')
  .get(getAdminCities);

router.route('/client-cities')
  .get(getClientCities);

router.route('/city/alias-exist')
  // @ts-ignore
  .post(doesAliasExist(CitiesModel));

router.route('/city/toggle-enabled')
  // @ts-ignore
  .patch(auth.authenticate(), auth.authorize(['admin', 'user']), toggleEnabled(CitiesModel));

router.route('/city/:cityId')
  .get(getCity)
  .put(auth.authenticate(), auth.authorize(['admin']), updateCity)
  .delete(auth.authenticate(), auth.authorize(['admin']), deleteCity);

export default router;
