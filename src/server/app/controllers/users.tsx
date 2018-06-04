const express = require('express');
const router = express.Router();
import Auth from './auth';
import { UsersModel as Users } from '../model/users';

router.get('/', (req, res) => {
  Users.find({}, 'id name role', (err, users) => {
    if (err) {
      res.send(err);
    }
    res.json(users);
  });
});
router.post('/login', Auth.login);
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await Users.findOne({id: req.params.userId }).exec();

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
