const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const Call = require('../models/Calls');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer-Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'call-recordings', // Folder in Cloudinary to save recordings
    resource_type: 'video', // Can be 'video', 'raw', or 'auto'
  },
});

const upload = multer({ storage: storage });

exports.uploadRecording = [upload.single('recording'), async (req, res) => {
  try {
    const { callId } = req.params;
    const recordingUrl = req.file.path; // Cloudinary URL

    const call = await Call.findByIdAndUpdate(
      callId,
      { recordingUrl: recordingUrl },
      { new: true }
    );

    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }

    res.status(200).json({ message: 'Recording uploaded and call updated successfully', call });
  } catch (error) {
    console.error('Error uploading recording:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}];

exports.triggerCall = async (req, res) => {
  const { callerId, customerNumber } = req.body;
  if (!callerId || !customerNumber) {
    return res.status(400).json({ error: 'Missing callerId or customerNumber' });
  }

  const call = new Call({
    callerId,
    customerNumber,
    status: 'initiated',
    startedAt: new Date(),
  });

  await call.save();

  res.json({ message: 'Call initiated', callId: call._id });
};

exports.updateCallStatus = async (req, res) => {
  const { callId, status, endedAt, recordingUrl } = req.body;
  if (!callId || !status) {
    return res.status(400).json({ error: 'Missing callId or status' });
  }

  const call = await Call.findById(callId);
  if (!call) return res.status(404).json({ error: 'Call not found' });

  call.status = status;
  if (endedAt) call.endedAt = new Date(endedAt);
  if (recordingUrl) call.recordingUrl = recordingUrl;

  await call.save();

  res.json({ message: 'Call status updated' });
};

exports.getCallHistory = async (req, res) => {
  const { callerId } = req.params;
  const calls = await Call.find({ callerId }).sort({ startedAt: -1 });
  res.json(calls);
};

exports.getAllCallHistory = async (req, res) => {
  try {
    const calls = await Call.find({}).sort({ startedAt: -1 });
    res.json(calls);
  } catch (error) {
    console.error('Error fetching all call history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};