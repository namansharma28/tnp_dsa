import { useState, useRef, useEffect } from 'react';
import styles from './Filters.module.css';

interface FiltersProps {
  topics: string[];
  difficulties: string[];
  selectedTopic: string;
  selectedDifficulty: string;
  searchQuery: string;
  onTopicChange: (topic: string) => void;
  onDifficultyChange: (difficulty: string) => void;
  onSearchChange: (query: string) => void;
}

// Custom drop-down selector component
interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder: string;
  className?: string;
}

const CustomSelect = ({ value, onChange, options, placeholder, className }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`${styles.customSelectContainer} ${className || ''}`} ref={containerRef}>
      <button 
        type="button" 
        className={styles.customSelectTrigger} 
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{value || placeholder}</span>
        <svg 
          className={`${styles.customSelectArrow} ${isOpen ? styles.customSelectArrowOpen : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <ul className={styles.customSelectOptions} role="listbox">
          <li 
            className={`${styles.customSelectOption} ${!value ? styles.customSelectOptionActive : ''}`}
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
            role="option"
            aria-selected={!value}
          >
            {placeholder}
          </li>
          {options.map((option) => (
            <li 
              key={option}
              className={`${styles.customSelectOption} ${value === option ? styles.customSelectOptionActive : ''}`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={value === option}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Filters = ({
  topics,
  difficulties,
  selectedTopic,
  selectedDifficulty,
  searchQuery,
  onTopicChange,
  onDifficultyChange,
  onSearchChange,
}: FiltersProps) => {
  return (
    <div className={styles.filters}>
      <div className={styles.container}>
        {/* Search Field */}
        <div className={styles.searchWrapper}>
          <svg
            className={styles.searchIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search questions..."
            className={styles.searchInput}
          />
        </div>

        {/* Custom Difficulty Select */}
        {difficulties.length > 0 && (
          <CustomSelect
            value={selectedDifficulty}
            onChange={onDifficultyChange}
            options={difficulties}
            placeholder="All Levels"
          />
        )}

        {/* Custom Topic Select */}
        <CustomSelect
          value={selectedTopic}
          onChange={onTopicChange}
          options={topics}
          placeholder="All Categories"
          className={styles.topicSelect}
        />
      </div>
    </div>
  );
};

export default Filters;
