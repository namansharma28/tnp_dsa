import { useEffect, useState } from 'react';
import type { Question } from '../types';
import styles from './Modal.module.css';

interface ModalProps {
  question: Question;
  isSolved: boolean;
  onToggleSolved: () => void;
  onClose: () => void;
}

const Modal = ({
  question,
  isSolved,
  onToggleSolved,
  onClose,
}: ModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 10);

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(false);
        setTimeout(() => onClose(), 250);
      }
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 250); // Wait for animation to complete
  };

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
      className={`${styles.overlay} ${isVisible ? styles.overlayVisible : ''}`} 
      onClick={handleClose}
    >
      <div 
        className={`${styles.modal} ${isVisible ? styles.modalVisible : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          className={styles.closeButton} 
          onClick={handleClose} 
          aria-label="Close details"
          title="Close"
        >
          <svg className={styles.closeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <span className={`${styles.badge} ${getDifficultyClass(question.difficulty)}`}>
              {question.difficulty}
            </span>
            <h2 className={styles.title}>{question.title}</h2>
          </div>
        </div>

        {/* Modal Content */}
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Topics</h3>
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

          <div className={styles.actionSection}>
            {/* Solved Toggle Indicator */}
            <button 
              onClick={onToggleSolved}
              className={`${styles.solveToggle} ${isSolved ? styles.solvedActive : ''}`}
            >
              <div className={`${styles.toggleIndicator} ${isSolved ? styles.toggleIndicatorOn : ''}`}>
                {isSolved && (
                  <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span>{isSolved ? 'Marked as Solved' : 'Mark as Solved'}</span>
            </button>

            {/* Primary Leetcode CTA */}
            <a
              href={question.leetcode_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.solveButton}
            >
              <span>Solve on LeetCode</span>
              <svg className={styles.solveCtaIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
