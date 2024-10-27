import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useTheme from '../hooks/useTheme';

const TitleBar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="titlebar">
      <button type="button" className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? (
          <Sun size={20} color="#f39c12" />
        ) : (
          <Moon size={20} color="#3498db" />
        )}
      </button>
    </div>
  );
};

export default TitleBar;
