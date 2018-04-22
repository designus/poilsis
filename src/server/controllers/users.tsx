const express = require('express');
const router = express.Router();
import Auth from './auth';
import { UsersModel as User } from '../model/users';

router.post('/login', Auth.login);
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findOne({id: req.params.userId }).exec();

    if (user === null) {
      throw new Error('User not found');
    }

    const {name, role, id} = user;
    res.status(200).send({name, role, id});
  } catch (err) {
    res.status(401).send({message: err});
  }
});

export default router;
