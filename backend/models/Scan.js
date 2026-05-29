import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  conditionName: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true
  },
  symptoms: {
    type: [String],
    default: []
  },
  causes: {
    type: [String],
    default: []
  },
  solutions: {
    type: [String],
    default: []
  },
  medicines: {
    type: [String],
    default: []
  },
  prevention: {
    type: [String],
    default: []
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low'
  },
  scannedAt: {
    type: Date,
    default: Date.now
  }
});

const Scan = mongoose.models.Scan || mongoose.model('Scan', scanSchema);
export default Scan;
