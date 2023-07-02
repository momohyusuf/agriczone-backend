const express = require('express');
const router = express.Router();

const { createReport } = require('../controllers/report/report');

router.post('/create-report', createReport);

module.exports = router;
