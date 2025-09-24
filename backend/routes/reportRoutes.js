
import express from 'express';

const router = express.Router();


router.post('/', (req, res) => {
    res.send('This will create a new report.');
});

router.get('/', (req, res) => {
    res.send('This will return all reports.');
});

export default router;