import { ExportedRow, VocabularyData } from '../types';

export class ExportService {
  private static formatDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private static downloadFile(
    content: string,
    fileType: string,
    extension: string,
  ): void {
    const blob = new Blob([content], { type: fileType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vocabulary-${this.formatDate()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  public static exportToJson(vocabulary: VocabularyData): void {
    const rememberedWords = localStorage.getItem('rememberedWords');
    const context = {
      vocabulary,
      rememberedWords: rememberedWords ? JSON.parse(rememberedWords) : {},
    };
    const jsonContent = JSON.stringify(context, null, 2);
    this.downloadFile(jsonContent, 'application/json', 'json');
  }

  public static exportToCsv(vocabulary: VocabularyData): void {
    const rows: ExportedRow[] = [];

    Object.entries(vocabulary).forEach(([category, words]) => {
      Object.entries(words).forEach(([word, translation]) => {
        rows.push({ category, word, translation });
      });
    });

    const csvContent = [
      ['Category', 'Word', 'Translation'],
      ...rows.map((row) => [
        this.escapeCsvCell(row.category),
        this.escapeCsvCell(row.word),
        this.escapeCsvCell(row.translation),
      ]),
    ].join('\n');

    this.downloadFile(csvContent, 'text/csv;charset=utf-8;', 'csv');
  }

  private static escapeCsvCell(cell: string): string {
    const escaped = cell.replace(/"/g, '""');
    return `"${escaped}"`;
  }
}
