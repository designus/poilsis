import { Router } from 'express';
import { auth, getAllCities, addNewCity, updateCity, deleteCity } from '../controllers';

const router = Router();

router.route('/')
  .get(getAllCities)
  .post(auth.authenticate(), auth.authorize(['admin']), addNewCity);

router.route('/city/:cityId')
  .put(auth.authenticate(), auth.authorize(['admin']), updateCity)
  .delete(auth.authenticate(), auth.authorize(['admin']), deleteCity);

export default router;
