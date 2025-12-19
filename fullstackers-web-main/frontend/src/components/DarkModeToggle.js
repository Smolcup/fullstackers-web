import React from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';
import './DarkModeToggle.css';

function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button 
      className={`dark-mode-toggle ${isDarkMode ? 'dark' : 'light'}`}
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <span className="toggle-icon">{isDarkMode ? '🌙' : '☀️'}</span>
    </button>
  );
}

export default DarkModeToggle;