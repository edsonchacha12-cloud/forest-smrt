const router = require('express').Router();
const controller = require('../controllers/alertController');

router.get('/', controller.getAlerts);
router.put('/:id/resolve', controller.resolveAlert);

module.exports = router;
