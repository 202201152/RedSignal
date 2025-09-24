import express from 'express';

import { createReport, getReports } from '../controllers/reportsController.js';

const router = express.Router();

router.route('/').post(createReport).get(getReports);


export default router;