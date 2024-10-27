import { Settings } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ExportService } from '../services/exportService';
import { VocabularyData } from '../types';

const OptionsDropdown = ({
  autoSpeak,
  onClickSpeak,
  speakDelay,
  onAutoSpeakChange,
  onClickSpeakChange,
  onSpeakDelayChange,
  onSetVocabulary,
  vocabulary,
  isRandomMode,
  setIsRandomMode,
  isAutoNext,
  setIsAutoNext,
  nextCard, // Callback function to go to the next card
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Handle automatic card progression if Auto Next is enabled
  useEffect(() => {
    if (isAutoNext) {
      const interval = setInterval(() => {
        nextCard();
      }, 10000); // Move to the next card every 10 seconds
      return () => clearInterval(interval);
    }
  }, [isAutoNext, nextCard]);

  const handleExportJson = () => {
    ExportService.exportToJson(vocabulary);
  };

  const handleExportCsv = () => {
    ExportService.exportToCsv(vocabulary);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      let importedVocabulary: VocabularyData;

      if (file.name.endsWith('.json')) {
        importedVocabulary = JSON.parse(text);
      } else if (file.name.endsWith('.csv')) {
        const rows = text
          .split('\n')
          .map((row) =>
            row
              .split(',')
              .map((cell) =>
                cell.trim().replace(/^"|"$/g, '').replace(/""/g, '"'),
              ),
          );

        importedVocabulary = {};
        for (let i = 1; i < rows.length; i += 1) {
          const [category, word, translation] = rows[i];
          if (category && word && translation) {
            if (!importedVocabulary[category]) {
              importedVocabulary[category] = {};
            }
            importedVocabulary[category][word] = translation;
          }
        }
      } else {
        throw new Error('Unsupported file format');
      }

      onSetVocabulary(importedVocabulary);
      localStorage.setItem('vocabulary', JSON.stringify(importedVocabulary));
      alert('Vocabulary imported successfully!');
    } catch (error) {
      alert('Error importing vocabulary: ' + (error as Error).message);
    }
    event.target.value = '';
  };

  return (
    <div className="options-dropdown">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="options-toggle"
      >
        <Settings size={20} />
      </button>

      {isOpen && (
        <div className="options-menu">
          <div className="options-content">
            <label className="option-label">
              <span>Auto Speak</span>
              <input
                type="checkbox"
                checked={autoSpeak}
                onChange={(e) => onAutoSpeakChange(e.target.checked)}
              />
            </label>
            <label className="option-label">
              <span>Click to Speak</span>
              <input
                type="checkbox"
                checked={onClickSpeak}
                onChange={(e) => onClickSpeakChange(e.target.checked)}
              />
            </label>
            <label className="option-label">
              <span>Random Mode</span>
              <input
                type="checkbox"
                checked={isRandomMode}
                onChange={(e) => setIsRandomMode(e.target.checked)}
              />
            </label>
            <label className="option-label">
              <span>Auto Next</span>
              <input
                type="checkbox"
                checked={isAutoNext}
                onChange={(e) => setIsAutoNext(e.target.checked)}
              />
            </label>
            <div className="option-slider">
              <span>Speak Delay (ms)</span>
              <input
                type="range"
                className="slider"
                min="0"
                max="2000"
                step="100"
                value={speakDelay}
                onChange={(e) => onSpeakDelayChange(Number(e.target.value))}
              />
              <div className="slider-value">{speakDelay}ms</div>
            </div>

            <div className="options-dropdown">
              <label htmlFor="import-vocabulary" className="btn">
                Import
              </label>
              <input
                type="file"
                accept=".json,.csv"
                onChange={handleImport}
                className="hidden"
                id="import-vocabulary"
              />
            </div>

            <div className="options-dropdown">
              <button
                type="button"
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="btn"
              >
                Export
              </button>
              {isExportOpen && (
                <div className="dropdown-menu">
                  <button type="button" onClick={handleExportJson}>
                    Export as JSON
                  </button>
                  <button type="button" onClick={handleExportCsv}>
                    Export as CSV
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionsDropdown;
