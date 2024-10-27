export interface VocabularyEntry {
  word: string;
  translation: string;
}

export interface VocabularyData {
  [mainCategory: string]: {
    [subCategory: string]: {
      [word: string]: string;
    };
  };
}

export interface CardData {
  category: string;
  word: string;
  translation: string;
}
export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface VocabularyWord {
  word: string;
  translation: string;
}

export interface VocabularyCategory {
  [word: string]: string;
}

export interface ExportedRow {
  category: string;
  word: string;
  translation: string;
}
