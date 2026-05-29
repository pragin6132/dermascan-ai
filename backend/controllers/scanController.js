import Scan from '../models/Scan.js';
import { classifySkinImage } from '../services/aiService.js';

// In-memory scan storage for Demo/Offline Mode
const mockScans = [
  {
    _id: 'mock_scan_1',
    userId: '60c72b2f9b1d8b23c4a242f1', // tied to demo admin
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=300&auto=format&fit=crop',
    conditionName: 'Eczema (Atopic Dermatitis)',
    confidence: 0.94,
    severity: 'Medium',
    symptoms: [
      "Dry, sensitive skin with intense itching (pruritus)",
      "Red to brownish-gray patches, especially on wrists and chest",
      "Thickened, cracked, or scaly skin areas"
    ],
    causes: [
      "Genetic factors affecting the skin's barrier function",
      "Immune system overreaction to environmental triggers",
      "Dry weather and low humidity drying out skin lipids"
    ],
    solutions: [
      "Apply high-quality emollient moisturizers within 3 minutes after bathing",
      "Apply cool, wet compresses to soothe active itching flare-ups"
    ],
    medicines: [
      "Topical Corticosteroids (e.g., Hydrocortisone 1%) to reduce redness",
      "Oral Antihistamines (e.g., Cetirizine) to suppress nightly itching"
    ],
    prevention: [
      "Moisturize skin at least twice daily with ceramide-infused creams",
      "Wear soft, breathable natural fibers such as 100% cotton"
    ],
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3 days ago
  },
  {
    _id: 'mock_scan_2',
    userId: '60c72b2f9b1d8b23c4a242f1', // tied to demo admin
    imageUrl: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=300&auto=format&fit=crop',
    conditionName: 'Contact Dermatitis (Allergic Reaction)',
    confidence: 0.89,
    severity: 'Low',
    symptoms: [
      "A red, blistering, or scaly rash localized strictly to the contact site",
      "Intense itching, burning, or tenderness"
    ],
    causes: [
      "Direct skin contact with nickel in wristband jewelry",
      "Exposure to harsh synthetic soaps"
    ],
    solutions: [
      "Wash the skin immediately with plenty of soap and lukewarm water",
      "Apply soothing Calamine lotion to dry out weeping blisters"
    ],
    medicines: [
      "Over-the-counter Hydrocortisone cream (1%)",
      "Calamine Lotion to calm itching"
    ],
    prevention: [
      "Wear protective gloves when handling cleaning detergents",
      "Remove jewelry containing nickel if rashes consistently develop beneath them"
    ],
    scannedAt: new Date(Date.now() - 1000 * 60 * 60 * 4) // 4 hours ago
  }
];

// @desc    Upload & analyze image for skin condition
// @route   POST /api/scans/analyze
export const analyzeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded.' });
    }

    console.log(`[ANALYSIS] Received file: ${req.file.originalname}, size: ${req.file.size} bytes`);

    // Classify using our high-fidelity AI service
    const analysisResult = await classifySkinImage(req.file);

    // Convert file buffer to base64 data URI to keep the asset self-contained and durable
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const mimeType = req.file.mimetype || 'image/jpeg';
    const base64DataUrl = `data:${mimeType};base64,${b64}`;

    if (global.isMockDB) {
      // Demo Offline mode logic
      const newScan = {
        _id: `mock_scan_${Date.now()}`,
        userId: req.user._id,
        imageUrl: base64DataUrl,
        ...analysisResult,
        scannedAt: new Date()
      };

      mockScans.unshift(newScan); // Add to the top of list
      console.log(`[DEMO DB] Saved new scan record: ${analysisResult.conditionName}`);
      return res.status(201).json(newScan);
    }

    // Standard MongoDB flow
    const scanRecord = await Scan.create({
      userId: req.user._id,
      imageUrl: base64DataUrl,
      ...analysisResult
    });

    res.status(201).json(scanRecord);
  } catch (error) {
    console.error('[ANALYSIS] Error analyzing skin image:', error);
    res.status(500).json({ message: 'AI Classification failed', error: error.message });
  }
};

// @desc    Get user's scan history logs
// @route   GET /api/scans/history
export const getScanHistory = async (req, res) => {
  try {
    if (global.isMockDB) {
      // Return scans filtered by userId
      const userScans = mockScans.filter(s => s.userId.toString() === req.user._id.toString());
      // Sort desc by scannedAt
      const sortedScans = [...userScans].sort((a, b) => b.scannedAt - a.scannedAt);
      return res.json(sortedScans);
    }

    // Standard MongoDB flow
    const scans = await Scan.find({ userId: req.user._id }).sort({ scannedAt: -1 });
    res.json(scans);
  } catch (error) {
    console.error('[HISTORY] Error fetching scan logs:', error);
    res.status(500).json({ message: 'Failed to retrieve scan history logs' });
  }
};

// @desc    Get details of a single scan
// @route   GET /api/scans/:id
export const getScanDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (global.isMockDB) {
      const scan = mockScans.find(s => s._id === id);
      if (scan && scan.userId.toString() === req.user._id.toString()) {
        return res.json(scan);
      }
      return res.status(404).json({ message: 'Scan record not found' });
    }

    // Standard MongoDB flow
    const scan = await Scan.findById(id);
    if (!scan) {
      return res.status(404).json({ message: 'Scan record not found' });
    }

    if (scan.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to this scan log' });
    }

    res.json(scan);
  } catch (error) {
    console.error('[DETAILS] Error fetching scan details:', error);
    res.status(500).json({ message: 'Failed to retrieve scan details' });
  }
};

// @desc    Delete a scan log from history
// @route   DELETE /api/scans/:id
export const deleteScan = async (req, res) => {
  try {
    const { id } = req.params;

    if (global.isMockDB) {
      const index = mockScans.findIndex(s => s._id === id && s.userId.toString() === req.user._id.toString());
      if (index !== -1) {
        mockScans.splice(index, 1);
        console.log(`[DEMO DB] Deleted scan: ${id}`);
        return res.json({ message: 'Scan record successfully deleted' });
      }
      return res.status(404).json({ message: 'Scan record not found or unauthorized' });
    }

    // Standard MongoDB flow
    const scan = await Scan.findById(id);
    if (!scan) {
      return res.status(404).json({ message: 'Scan record not found' });
    }

    if (scan.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this scan log' });
    }

    await scan.deleteOne();
    res.json({ message: 'Scan record successfully deleted' });
  } catch (error) {
    console.error('[DELETE] Error deleting scan:', error);
    res.status(500).json({ message: 'Failed to delete scan record' });
  }
};

export default { analyzeImage, getScanHistory, getScanDetails, deleteScan };
