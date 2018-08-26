const express = require('express');
const router = express.Router();
import { auth, getUserProfile, getAllUsers } from '../controllers';

router.get('/', getAllUsers);
router.post('/login', auth.login);
router.get('/profile/:userId', getUserProfile);

export default router;
