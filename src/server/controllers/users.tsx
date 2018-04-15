const express = require('express');
const router = express.Router();
import Auth from './auth';
import { UsersModel as User } from '../model/users';

router.post('/login', Auth.login);
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findOne({_id: req.params.userId }).exec();

    if (user === null) {
      throw new Error('User not found');
    }

    res.status(200).send({name: user.name, role: user.role});
  } catch (err) {
    res.status(401).send({message: err});
  }
});

export default router;
