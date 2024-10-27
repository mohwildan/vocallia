import { VocabularyData } from '../types';

export class ImportService {
  public static async importFile(file: File): Promise<VocabularyData> {
    const text = await file.text();

    if (file.name.endsWith('.json')) {
      return this.parseJson(text);
    } else if (file.name.endsWith('.csv')) {
      return this.parseCsv(text);
    }

    throw new Error('Unsupported file format. Please use .json or .csv files.');
  }

  private static validateVocabularyData(
    data: unknown,
  ): asserts data is VocabularyData {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid vocabulary data format');
    }

    for (const [category, words] of Object.entries(data)) {
      if (typeof category !== 'string' || !category) {
        throw new Error(`Invalid category: ${category}`);
      }

      if (!words || typeof words !== 'object') {
        throw new Error(`Invalid words for category: ${category}`);
      }

      for (const [word, translation] of Object.entries(words)) {
        if (typeof word !== 'string' || !word) {
          throw new Error(`Invalid word in category ${category}`);
        }
        if (typeof translation !== 'string' || !translation) {
          throw new Error(
            `Invalid translation for word ${word} in category ${category}`,
          );
        }
      }
    }
  }

  private static parseJson(text: string): VocabularyData {
    try {
      const parsed = JSON.parse(text);
      this.validateVocabularyData(parsed);
      return parsed;
    } catch (error) {
      throw new Error(`Invalid JSON format: ${(error as Error).message}`);
    }
  }

  private static parseCsv(text: string): VocabularyData {
    const rows = text
      .split('\n')
      .map((row) =>
        row
          .split(',')
          .map((cell) => cell.trim().replace(/^"|"$/g, '').replace(/""/g, '"')),
      );

    if (rows.length < 2) {
      throw new Error(
        'CSV file must contain at least a header row and one data row',
      );
    }

    const headerRow = rows[0];
    if (
      headerRow.length !== 3 ||
      !headerRow.includes('Category') ||
      !headerRow.includes('Word') ||
      !headerRow.includes('Translation')
    ) {
      throw new Error('CSV must have Category, Word, and Translation columns');
    }

    const categoryIndex = headerRow.indexOf('Category');
    const wordIndex = headerRow.indexOf('Word');
    const translationIndex = headerRow.indexOf('Translation');

    const vocabulary: VocabularyData = {};

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length !== 3) continue;

      const category = row[categoryIndex].trim();
      const word = row[wordIndex].trim();
      const translation = row[translationIndex].trim();

      if (!category || !word || !translation) {
        throw new Error(`Invalid data in row ${i + 1}`);
      }

      if (!vocabulary[category]) {
        vocabulary[category] = {};
      }

      vocabulary[category][word] = translation;
    }

    return vocabulary;
  }
}
