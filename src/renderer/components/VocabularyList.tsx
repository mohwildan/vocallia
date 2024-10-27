import React, { useState, useMemo } from 'react';
import { VocabularyData, CardData } from '../types';

interface VocabularyListProps {
  vocabulary: VocabularyData;
}

const VocabularyList: React.FC<VocabularyListProps> = ({ vocabulary }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<keyof CardData>('category');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const categories = useMemo(
    () => ['all', ...Object.keys(vocabulary).sort()],
    [vocabulary],
  );

  const vocabularyRows = useMemo(() => {
    const rows: CardData[] = [];
    Object.entries(vocabulary).forEach(([category, subCategories]) => {
      Object.entries(subCategories).forEach(([subCategory, words]) => {
        Object.entries(words).forEach(([word, translation]) => {
          rows.push({
            category: `${category} - ${subCategory}`,
            word,
            translation,
          });
        });
      });
    });
    return rows;
  }, [vocabulary]);

  const filteredAndSortedRows = useMemo(() => {
    return vocabularyRows
      .filter(
        (row) =>
          (selectedCategory === 'all' ||
            row.category.includes(selectedCategory)) &&
          (row.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.translation.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      .sort((a, b) => {
        const compareResult = a[sortColumn].localeCompare(b[sortColumn]);
        return sortDirection === 'asc' ? compareResult : -compareResult;
      });
  }, [vocabularyRows, selectedCategory, searchTerm, sortColumn, sortDirection]);

  const handleSort = (column: keyof CardData) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <div className="vocabulary-list">
      <div className="list-header">
        <h2>Vocabulary List</h2>
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
              filteredAndSortedRows.map((row, index) => (
                <tr key={index}>
                  <td>{row.category}</td>
                  <td>{row.word}</td>
                  <td>{row.translation}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center' }}>
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
