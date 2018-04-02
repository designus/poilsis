const express = require('express');
const router = express.Router();
import auth from './auth';
import { TokensModel } from '../model/tokens';

router.route('/:userId')
  .delete(auth.authenticate(), async (req, res) => {
    try {
      const token = await TokensModel.findOneAndRemove({userId: req.params.userId }).exec();

      if (!token) {
        throw new Error('Token not found');
      }

      res.status(200).send({message: ''});
    } catch (err) {
      res.status(401).send({message: err});
    }
  });

export default router;
