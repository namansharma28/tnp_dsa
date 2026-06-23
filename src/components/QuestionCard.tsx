import type { Question } from '../types';
import styles from './QuestionCard.module.css';

interface QuestionCardProps {
  question: Question;
  isSolved: boolean;
  onToggleSolved: (e: React.MouseEvent) => void;
  onClick: () => void;
}

const QuestionCard = ({
  question,
  isSolved,
  onToggleSolved,
  onClick,
}: QuestionCardProps) => {
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
      className={`${styles.card} ${isSolved ? styles.cardSolved : ''}`} 
      onClick={onClick}
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
        <span className={`${styles.badge} ${getDifficultyClass(question.difficulty)}`}>
          {question.difficulty}
        </span>
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
