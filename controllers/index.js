const express = require('express');
const router = express.Router();
router.use('/api/soldiers', require('./soldiers'));
module.exports = router;