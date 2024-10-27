import React, { useCallback, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CardData } from '../types';

interface Props {
  data: CardData;
  autoSpeak: boolean;
  speakDelay: number;
  onClickSpeak: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const VocabularyCard: React.FC<Props> = ({
  data,
  autoSpeak,
  speakDelay,
  onClickSpeak,
  onPrevious,
  onNext,
}) => {
  const speak = useCallback((text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }, []);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (autoSpeak && data.word) {
      window.speechSynthesis.cancel();
      timer = setTimeout(() => speak(data.word), speakDelay);
    }
    return () => {
      clearTimeout(timer);
      window.speechSynthesis.cancel();
    };
  }, [data.word, autoSpeak, speakDelay, speak]);
  const handleClick = () => {
    if (onClickSpeak) {
      speak(data.word);
    }
  };
  // const handleClick = () => {
  //   if (onClickSpeak) {
  //     const utterance = new SpeechSynthesisUtterance(data.word);
  //     utterance.lang = 'en-US';
  //     window.speechSynthesis.speak(utterance);
  //   }
  // };

  return (
    <div className="card" style={{ position: 'relative' }}>
      {!data.word ? (
        <p>No vocabulary found</p>
      ) : (
        <>
          <button
            type="button"
            onClick={onPrevious}
            style={{
              position: 'absolute',
              left: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#3498db',
            }}
          >
            <ArrowLeft size={24} /> {/* Ikon panah kiri */}
          </button>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div
              className="word fade-in"
              onClick={handleClick}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => e.key === 'Enter' && handleClick()}
              style={{ cursor: 'pointer' }}
            >
              <h2>{data.word}</h2>
            </div>
            <div className="translation fade-in">
              <p>{data.translation}</p>
            </div>
            <div className="category fade-in">
              <small>Category: {data.category}</small>
            </div>
          </div>

          <button
            type="button"
            onClick={onNext}
            style={{
              position: 'absolute',
              right: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#3498db',
            }}
          >
            <ArrowRight size={24} /> {/* Ikon panah kanan */}
          </button>
        </>
      )}
    </div>
  );
};

export default VocabularyCard;
