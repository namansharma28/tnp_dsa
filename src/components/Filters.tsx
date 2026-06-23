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

        <select
          value={selectedDifficulty}
          onChange={(e) => onDifficultyChange(e.target.value)}
          className={styles.select}
        >
          <option value="">All Levels</option>
          {difficulties.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {difficulty}
            </option>
          ))}
        </select>

        <select
          value={selectedTopic}
          onChange={(e) => onTopicChange(e.target.value)}
          className={`${styles.select} ${styles.topicSelect}`}
        >
          <option value="">All Categories</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;
