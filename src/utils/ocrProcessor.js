import Tesseract from 'tesseract.js';
import { GENERIC_DRUGS, validateAndCorrectDrugs, filterValidDrugs } from './drugDatabase';

/**
 * Extract text from an image using Tesseract OCR
 */
export const extractTextFromImage = async (imageSource, onProgress) => {
  try {
    const result = await Tesseract.recognize(imageSource, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text' && onProgress) {
          onProgress(Math.round(m.progress * 100));
        }
      }
    });

    return {
      success: true,
      text: result.data.text,
      confidence: result.data.confidence
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      text: ''
    };
  }
};

/**
 * Parse extracted OCR text to identify drugs and dosages.
 * Validates every detected name against the drug database:
 *   - Known names are normalised to their canonical form
 *   - 1-character OCR typos (e.g. "Tbuprofen") are auto-corrected
 *   - Names with close suggestions are flagged for user review
 *   - Pure garbage (e.g. "abe acetal") is silently dropped
 */
export const parsePrescriptionText = (text) => {
  const rawDrugs = [];

  // Common drug name patterns
  const drugPatterns = [
    /([A-Za-z]+(?:\s+[A-Za-z]+)?)\s+(\d+(?:\.\d+)?)\s*(mg|mcg|g|ml|units?)/gi,
    /(?:rx|tab|cap|tablet|capsule)[:\s]+([A-Za-z]+)\s+(\d+(?:\.\d+)?)\s*(mg|mcg|g)/gi,
    /\d+\.\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)\s+[-–]\s+(\d+(?:\.\d+)?)\s*(mg|mcg|g)/gi,
  ];

  const frequencyMap = {
    'once daily': 1, 'od': 1, 'qd': 1, 'q24h': 1,
    'twice daily': 2, 'bid': 2, 'bd': 2, 'q12h': 2,
    'three times': 3, 'tid': 3, 'tds': 3, 'q8h': 3,
    'four times': 4, 'qid': 4, 'qds': 4, 'q6h': 4,
  };

  const foundDrugs = new Set();

  drugPatterns.forEach(pattern => {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(text)) !== null) {
      const drugName = match[1].trim();
      const dosage   = parseFloat(match[2]);
      const unit     = match[3].toLowerCase();

      if (!foundDrugs.has(drugName.toLowerCase())) {
        foundDrugs.add(drugName.toLowerCase());

        let frequency = 1;
        const context = text.substring(
          Math.max(0, match.index - 50),
          Math.min(text.length, match.index + 100)
        ).toLowerCase();
        for (const [key, value] of Object.entries(frequencyMap)) {
          if (context.includes(key)) { frequency = value; break; }
        }

        rawDrugs.push({
          name: drugName,
          dosage: dosage.toString(),
          unit,
          frequency: frequency.toString(),
          source: 'ocr',
        });
      }
    }
  });

  // Fallback: scan for known drug names directly in text
  const textLower = text.toLowerCase();
  GENERIC_DRUGS.forEach(drug => {
    if (textLower.includes(drug) && !foundDrugs.has(drug)) {
      const drugIndex = textLower.indexOf(drug);
      const context   = text.substring(drugIndex, drugIndex + 50);
      const dosageMatch = context.match(/(\d+(?:\.\d+)?)\s*(mg|mcg|g)/i);
      if (dosageMatch) {
        foundDrugs.add(drug);
        rawDrugs.push({
          name: drug.charAt(0).toUpperCase() + drug.slice(1),
          dosage: dosageMatch[1],
          unit: dosageMatch[2].toLowerCase(),
          frequency: '1',
          source: 'ocr',
        });
      }
    }
  });

  // Validate, auto-correct, and filter out garbage
  const validated = validateAndCorrectDrugs(rawDrugs);
  return filterValidDrugs(validated);
};
