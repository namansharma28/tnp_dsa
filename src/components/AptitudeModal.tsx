import styles from './AptitudeModal.module.css';
import type { AptitudeQuestion } from '../types';

interface AptitudeModalProps {
  question: AptitudeQuestion;
  isSolved: boolean;
  onToggleSolved: () => void;
  onClose: () => void;
}

const getLinkLabel = (url: string, index: number) => {
  try {
    const hostname = new URL(url).hostname;
    const clean = hostname.replace('www.', '').split('.')[0];
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  } catch {
    return `Practice Resource ${index + 1}`;
  }
};

const AptitudeModal = ({ question, isSolved, onToggleSolved, onClose }: AptitudeModalProps) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        
        <div className={styles.header}>
          <span className={styles.categoryBadge}>{question.topics}</span>
          <h2 className={styles.title}>{question.title}</h2>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>
            Select a practice resource below to solve questions on this topic.
          </p>

          <div className={styles.linksGrid}>
            {question.practice_urls.map((url, idx) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkCard}
              >
                <div className={styles.linkCardInfo}>
                  <span className={styles.linkLabel}>{getLinkLabel(url, idx)}</span>
                  <span className={styles.linkUrl}>{url}</span>
                </div>
                <svg className={styles.linkIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <button 
            className={`${styles.solveBtn} ${isSolved ? styles.solved : ''}`}
            onClick={onToggleSolved}
          >
            <span className={styles.checkboxCircle}>
              {isSolved && (
                <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </span>
            <span>{isSolved ? 'Marked as Solved' : 'Mark as Solved'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AptitudeModal;
