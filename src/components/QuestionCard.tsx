import type { Question } from '../types';
import styles from './QuestionCard.module.css';

interface QuestionCardProps {
  question: Question;
  onClick: () => void;
}

const QuestionCard = ({ question, onClick }: QuestionCardProps) => {
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

  const getCardBorderClass = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return styles.cardEasy;
      case 'Medium':
        return styles.cardMedium;
      case 'Hard':
        return styles.cardHard;
      default:
        return '';
    }
  };

  const getTopicColorClass = (topic: string) => {
    // Basic hash function to consistently map a topic name to a styling color class
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
      className={`${styles.card} ${getCardBorderClass(question.difficulty)}`} 
      onClick={onClick}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{question.title}</h3>
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
