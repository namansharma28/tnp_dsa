import type { Question, AptitudeQuestion } from '../types';
import styles from './QuestionCard.module.css';

interface QuestionCardProps {
  question: Question | AptitudeQuestion;
  isSolved: boolean;
  isBookmarked?: boolean;
  onToggleSolved: (e: React.MouseEvent) => void;
  onToggleBookmark?: (e: React.MouseEvent) => void;
  onClick: () => void;
}

const QuestionCard = ({
  question,
  isSolved,
  isBookmarked,
  onToggleSolved,
  onToggleBookmark,
  onClick,
}: QuestionCardProps) => {
  const isAptitude = !('difficulty' in question);

  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return styles.badgeEasy;
      case 'Medium':
        return styles.badgeMedium;
      case 'Hard':
        return styles.badgeHard;
      default:
        return '';
    }
  };

  const getTopicColorClass = (topic: string) => {
    const hash = topic.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      styles.topicBlue,
      styles.topicPurple,
      styles.topicIndigo,
      styles.topicPink,
      styles.topicTeal,
      styles.topicEmerald,
    ];
    return colors[hash % colors.length];
  };

  const topics = question.topics.split('|');

  return (
    <div 
      className={`${styles.card} ${isSolved ? styles.cardSolved : ''} ${isAptitude ? styles.aptitudeCard : ''}`} 
      onClick={onClick}
      title={isAptitude ? "Click to view practice resources" : "Click to view details"}
    >
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <button 
            className={`${styles.checkbox} ${isSolved ? styles.checkboxSolved : ''}`}
            onClick={onToggleSolved}
            aria-label={isSolved ? "Mark as unsolved" : "Mark as solved"}
            title={isSolved ? "Mark as unsolved" : "Mark as solved"}
          >
            {isSolved && (
              <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          <h3 className={styles.title}>{question.title}</h3>
        </div>
        
        {!isAptitude && 'difficulty' in question && (
          <div className={styles.metaActions}>
            <span className={`${styles.badge} ${getDifficultyClass(question.difficulty)}`}>
              {question.difficulty}
            </span>
            {onToggleBookmark && (
              <button
                className={`${styles.cardBookmarkButton} ${isBookmarked ? styles.bookmarkActive : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(e);
                }}
                aria-label={isBookmarked ? "Remove from revision" : "Save for revision"}
                title={isBookmarked ? "Remove from revision" : "Save for revision"}
              >
                <svg className={styles.bookmarkIcon} viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      <div className={styles.topics}>
        {topics.map((topic, index) => (
          <span 
            key={index} 
            className={`${styles.topicBadge} ${getTopicColorClass(topic.trim())}`}
          >
            {topic.trim()}
          </span>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
