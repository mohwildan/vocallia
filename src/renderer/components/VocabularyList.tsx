import React, { useState, useMemo, useEffect } from 'react';
import { VocabularyData, CardData } from '../types';
import { Check } from 'lucide-react';

interface VocabularyListProps {
  vocabulary: VocabularyData;
}

interface RememberedWords {
  [key: string]: boolean;
}

const VocabularyList: React.FC<VocabularyListProps> = ({ vocabulary }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<keyof CardData>('category');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [rememberedWords, setRememberedWords] = useState<RememberedWords>({});

  useEffect(() => {
    const savedRememberedWords = localStorage.getItem('remembered-words');
    if (savedRememberedWords) {
      setRememberedWords(JSON.parse(savedRememberedWords));
    }
  }, []);

  // Save to localStorage whenever rememberedWords changes
  useEffect(() => {
    localStorage.setItem('remembered-words', JSON.stringify(rememberedWords));
  }, [rememberedWords]);

  const categories = useMemo(
    () => ['all', ...Object.keys(vocabulary).sort()],
    [vocabulary],
  );

  const vocabularyRows = useMemo(() => {
    const rows: (CardData & { id: string })[] = [];
    Object.entries(vocabulary).forEach(([category, words]: any) => {
      Object.entries(words).forEach(([word, translation]: any) => {
        // Create a unique ID for each word
        const id = `${category}-${word}`;
        rows.push({
          id,
          category,
          word,
          translation,
        });
      });
    });
    return rows;
  }, [vocabulary]);

  const filteredAndSortedRows = useMemo(() => {
    return vocabularyRows
      .filter(
        (row) =>
          (selectedCategory === 'all' || row.category === selectedCategory) &&
          (row.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.translation.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      .sort((a, b) => {
        if (sortColumn === 'remembered') {
          return sortDirection === 'asc'
            ? (rememberedWords[b.id] ? 1 : 0) - (rememberedWords[a.id] ? 1 : 0)
            : (rememberedWords[a.id] ? 1 : 0) - (rememberedWords[b.id] ? 1 : 0);
        }
        const compareResult = a[sortColumn].localeCompare(b[sortColumn]);
        return sortDirection === 'asc' ? compareResult : -compareResult;
      });
  }, [
    vocabularyRows,
    selectedCategory,
    searchTerm,
    sortColumn,
    sortDirection,
    rememberedWords,
  ]);

  const handleSort = (column: keyof CardData | 'remembered') => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const toggleRemembered = (id: string) => {
    setRememberedWords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const rememberedCount = useMemo(() => {
    return Object.values(rememberedWords).filter(Boolean).length;
  }, [rememberedWords]);

  const totalWords = vocabularyRows.length;

  return (
    <div className="vocabulary-list">
      <div className="list-header">
        <h2>Vocabulary List</h2>
        <div className="progress-info">
          Remembered: {rememberedCount} of {totalWords} (
          {Math.round((rememberedCount / totalWords) * 100)}%)
        </div>
        <div className="list-controls">
          <input
            type="text"
            placeholder="Search words or translations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-label="Search vocabulary"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
            aria-label="Filter by category"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="vocabulary-table">
          <thead>
            <tr>
              <th
                onClick={() => handleSort('remembered')}
                className={`sortable ${
                  sortColumn === 'remembered' ? `sorted-${sortDirection}` : ''
                }`}
                aria-sort={sortColumn === 'remembered' ? sortDirection : 'none'}
              >
                Remembered
              </th>
              {(['category', 'word', 'translation'] as const).map((column) => (
                <th
                  key={column}
                  onClick={() => handleSort(column)}
                  className={`sortable ${
                    sortColumn === column ? `sorted-${sortDirection}` : ''
                  }`}
                  aria-sort={sortColumn === column ? sortDirection : 'none'}
                  role="columnheader"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleSort(column)}
                >
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedRows.length > 0 ? (
              filteredAndSortedRows.map((row) => (
                <tr key={row.id}>
                  <td className="checkbox-cell">
                    <button
                      onClick={() => toggleRemembered(row.id)}
                      className={`checkbox-button ${rememberedWords[row.id] ? 'checked' : ''}`}
                      aria-label={`Mark "${row.word}" as ${
                        rememberedWords[row.id]
                          ? 'not remembered'
                          : 'remembered'
                      }`}
                    >
                      {rememberedWords[row.id] && (
                        <Check className="check-icon" />
                      )}
                    </button>
                  </td>
                  <td>{row.category}</td>
                  <td>{row.word}</td>
                  <td>{row.translation}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="no-results">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VocabularyList;
