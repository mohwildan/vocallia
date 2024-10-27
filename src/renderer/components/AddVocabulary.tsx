import React, { useState, ChangeEvent, FormEvent } from 'react';

interface Props {
  onAddVocabulary: (
    category: string,
    subCategory: string,
    word: string,
    translation: string,
  ) => void;
}

const AddVocabulary: React.FC<Props> = ({ onAddVocabulary }) => {
  const categories = ['Nouns', 'Verbs', 'Adjectives', 'Adverbs'];
  const [category, setCategory] = useState<string>(categories[0]);
  const [word, setWord] = useState<string>('');
  const [translation, setTranslation] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (word && translation) {
      onAddVocabulary(category, '', word, translation);
      setWord('');
      setTranslation('');
    }
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleWordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWord(e.target.value);
  };

  const handleTranslationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTranslation(e.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="add-vocab-section"
      aria-labelledby="add-vocab-title"
    >
      <h3 id="add-vocab-title">Add New Vocabulary</h3>
      <div>
        <label htmlFor="category-select">Category:</label>
        <select
          id="category-select"
          value={category}
          onChange={handleCategoryChange}
          required
          aria-label="Select a category"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="word-input">English Word:</label>
        <input
          id="word-input"
          type="text"
          value={word}
          onChange={handleWordChange}
          placeholder="Enter the English word"
          required
          aria-label="Enter the English word"
        />
      </div>
      <div>
        <label htmlFor="translation-input">Translation:</label>
        <input
          id="translation-input"
          type="text"
          value={translation}
          onChange={handleTranslationChange}
          placeholder="Enter the translation"
          required
          aria-label="Enter the translation"
        />
      </div>
      <button type="submit" className="add-vocabulary-button">
        Add Vocabulary
      </button>
    </form>
  );
};

export default AddVocabulary;
