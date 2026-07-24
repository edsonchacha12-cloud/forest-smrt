const router = require('express').Router();
const controller = require('../controllers/sensorController');

router.post('/', controller.addReading);
router.get('/', controller.getReadings);

module.exports = router;
