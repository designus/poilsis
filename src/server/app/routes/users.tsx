const express = require('express');
const router = express.Router();
import { auth, getUserProfile, getAllUsers } from '../controllers';

router.get('/', getAllUsers);
router.get('/profile/:userId', getUserProfile);
router.post('/login', auth.login);
router.post('/reauthenticate', auth.reauthenticate);
router.delete('/logout/:userId', auth.logout);

export default router;
