import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import TitleBar from './components/TitleBar';
import VocabularyCard from './components/VocabularyCard';
import AddVocabulary from './components/AddVocabulary';
import Modal from './components/Modal';
import OptionsDropdown from './components/OptionsDropdown';
import VocabularyList from './components/VocabularyList';

const getInitialVocabulary = (): Record<string, Record<string, string>> => {
  const savedVocabulary = localStorage.getItem('vocabulary');
  return savedVocabulary
    ? JSON.parse(savedVocabulary)
    : {
        Nouns: {
          Hello: 'Halo',
          Goodbye: 'Selamat tinggal',
        },
        Verbs: {
          Run: 'Berlari',
          Walk: 'Berjalan',
        },
        Adjectives: {
          Beautiful: 'Cantik',
          Smart: 'Pintar',
        },
        Adverbs: {
          Quickly: 'Dengan cepat',
          Slowly: 'Dengan lambat',
        },
      };
};

const Hello = () => {
  const [vocabulary, setVocabulary] = useState(getInitialVocabulary());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalListOpen, setIsModalListOpen] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [onClickSpeak, setOnClickSpeak] = useState(true);
  const [speakDelay, setSpeakDelay] = useState(0);
  const [isRandomMode, setIsRandomMode] = useState(true);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [autoNext, setAutoNext] = useState(true);

  const vocabularyEntries = Object.keys(vocabulary).flatMap((category) =>
    Object.entries(vocabulary[category]).map(([word, translation]) => ({
      category,
      word,
      translation,
    })),
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const shuffleArray = (array: number[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    const indices = Array.from(
      { length: vocabularyEntries.length },
      (_, i) => i,
    );
    setShuffledIndices(shuffleArray(indices));
  }, [vocabularyEntries.length]);

  const getCurrentCard = () => {
    const index = isRandomMode ? shuffledIndices[currentIndex] : currentIndex;
    return (
      vocabularyEntries[index] || {
        category: '',
        word: '',
        translation: '',
      }
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : vocabularyEntries.length - 1,
    );
  };

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex < vocabularyEntries.length - 1 ? prevIndex + 1 : 0,
    );
  }, [vocabularyEntries.length]);

  const handleAddVocabulary = (
    category: string,
    subCategory: string,
    word: string,
    translation: string,
  ) => {
    const updatedCategory = {
      ...vocabulary[category],
      [word]: translation,
    };

    const newVocabulary = {
      ...vocabulary,
      [category]: updatedCategory,
    };

    localStorage.setItem('vocabulary', JSON.stringify(newVocabulary));
    setVocabulary(newVocabulary);
    setIsModalOpen(false);
  };

  const currentCard = getCurrentCard();

  // Automatically move to the next card every 10 seconds if autoNext is enabled
  useEffect(() => {
    if (!autoNext) return;

    const intervalId = setInterval(handleNext, 10000); // 10 seconds

    clearInterval(intervalId);
  }, [autoNext, handleNext]);

  return (
    <div className="container">
      <div className="header">
        <TitleBar />
        <div className="header-controls">
          {/* <button
            type="button"
            onClick={handleRandomToggle}
            className={`random-mode-btn ${isRandomMode ? 'active' : ''}`}
          >
            {isRandomMode ? 'Sequential Mode' : 'Random Mode'}
          </button>
          <button
            type="button"
            onClick={() => setAutoNext(!autoNext)}
            className={`auto-next-btn ${autoNext ? 'active' : ''}`}
          >
            {autoNext ? 'Stop Auto Next' : 'Start Auto Next'}
          </button> */}
          <OptionsDropdown
            autoSpeak={autoSpeak}
            onClickSpeak={onClickSpeak}
            speakDelay={speakDelay}
            vocabulary={vocabulary}
            onAutoSpeakChange={setAutoSpeak}
            onClickSpeakChange={setOnClickSpeak}
            onSpeakDelayChange={setSpeakDelay}
            onSetVocabulary={setVocabulary}
            isRandomMode={isRandomMode}
            setIsRandomMode={setIsRandomMode}
            isAutoNext={autoNext}
            setIsAutoNext={setAutoNext}
            nextCard={handleNext}
          />
          <button
            type="button"
            onClick={() => setIsModalListOpen(true)}
            className="view-list-btn"
          >
            View List
          </button>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="add-word-btn"
          >
            Add Word
          </button>
        </div>
      </div>

      <VocabularyCard
        data={currentCard}
        autoSpeak={autoSpeak}
        speakDelay={speakDelay}
        onClickSpeak={onClickSpeak}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddVocabulary onAddVocabulary={handleAddVocabulary} />
      </Modal>
      <Modal isOpen={isModalListOpen} onClose={() => setIsModalListOpen(false)}>
        <VocabularyList vocabulary={vocabulary} />
      </Modal>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Hello />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
