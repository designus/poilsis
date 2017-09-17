const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({message: 'API initialized'});
});

router.use('/cities', require('./cities'));
router.use('/types', require('./types'));
router.use('/items', require('./items'));

module.exports = router;
