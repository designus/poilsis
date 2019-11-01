import { Router } from 'express';
import { auth, getAllCities, addNewCity, updateCity, deleteCity, getCity, doesAliasExist, toggleEnabled } from '../controllers';

import { CitiesModel } from '../model';

const router = Router();

router.route('/')
  .get(getAllCities)
  .post(auth.authenticate(), auth.authorize(['admin']), addNewCity);

router.route('/city/alias-exist')
  .post(doesAliasExist(CitiesModel));

router.route('/city/toggle-enabled')
  .patch(auth.authenticate(), auth.authorize(['admin', 'user']), toggleEnabled(CitiesModel));

router.route('/city/:cityId')
  .get(getCity)
  .put(auth.authenticate(), auth.authorize(['admin']), updateCity)
  .delete(auth.authenticate(), auth.authorize(['admin']), deleteCity);

export default router;
