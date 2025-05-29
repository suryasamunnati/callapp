const express = require('express');
const router = express.Router();
const callController = require('../controllers/callController');

router.post('/upload-recording/:callId', callController.uploadRecording);
router.post('/trigger-call', callController.triggerCall);
router.post('/call-status', callController.updateCallStatus);
router.get('/call-history/:callerId', callController.getCallHistory);

module.exports = router;