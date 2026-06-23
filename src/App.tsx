import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import QuestionCard from './components/QuestionCard';
import Filters from './components/Filters';
import Pagination from './components/Pagination';
import Modal from './components/Modal';
import type { Question } from './types';
import { parseCSV } from './utils/csvParser';
import styles from './App.module.css';

const ITEMS_PER_PAGE = 12;

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load CSV data
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/questions.csv');
        const csvText = await response.text();
        const parsedQuestions = parseCSV(csvText);
        setQuestions(parsedQuestions);
      } catch (error) {
        console.error('Error loading questions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // Get unique topics and difficulties
  const topics = useMemo(() => {
    const topicSet = new Set<string>();
    questions.forEach((q) => {
      q.topics.split('|').forEach((topic) => topicSet.add(topic.trim()));
    });
    return Array.from(topicSet).sort();
  }, [questions]);

  const difficulties = useMemo(() => {
    return ['Easy', 'Medium', 'Hard'];
  }, []);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesSearch =
        debouncedSearch === '' ||
        question.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        question.topics.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesDifficulty =
        selectedDifficulty === '' || question.difficulty === selectedDifficulty;

      const matchesTopic =
        selectedTopic === '' || question.topics.split('|').map(t => t.trim()).includes(selectedTopic);

      return matchesSearch && matchesDifficulty && matchesTopic;
    });
  }, [questions, debouncedSearch, selectedDifficulty, selectedTopic]);

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredQuestions.slice(start, end);
  }, [filteredQuestions, currentPage]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <Header />

      <main className={styles.main}>
        {/* Welcome Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.heroTagline}>Training & Placement Cell, RGPV</span>
            <h1 className={styles.heroTitle}>Master Your Coding Interviews</h1>
            <p className={styles.heroDescription}>
              Welcome to the official Curated DSA Practice Portal. Solve hand-picked data structures and algorithms questions selected by placement cell officers to sharpen your skills and excel in company recruitment exams.
            </p>
          </div>
          <div className={styles.heroVisual}>
            <img src="/tnp_logo.jpg" alt="T&P Cell RGPV" className={styles.heroImage} />
          </div>
        </section>

        {/* Filters */}
        <Filters
          topics={topics}
          difficulties={difficulties}
          selectedTopic={selectedTopic}
          selectedDifficulty={selectedDifficulty}
          searchQuery={searchQuery}
          onTopicChange={(topic) => {
            setSelectedTopic(topic);
            setCurrentPage(1);
          }}
          onDifficultyChange={(difficulty) => {
            setSelectedDifficulty(difficulty);
            setCurrentPage(1);
          }}
          onSearchChange={(query) => {
            setSearchQuery(query);
            setCurrentPage(1);
          }}
        />

        {/* Questions Grid Section */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Curated Problems</h2>
          <p className={styles.sectionDescription}>
            Showing {filteredQuestions.length} of {questions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
            {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
          </p>
        </div>

        {paginatedQuestions.length > 0 ? (
          <>
            <div className={styles.grid}>
              {paginatedQuestions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onClick={() => setSelectedQuestion(question)}
                />
              ))}
            </div>
            
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3 className={styles.emptyTitle}>No matching questions</h3>
            <p className={styles.emptyDescription}>Try adjusting your keywords or filters to find problems.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>
            Training and Placement cell, RGPV © {new Date().getFullYear()} • Curated for Excellence
          </p>
        </div>
      </footer>

      {/* Detail Modal */}
      {selectedQuestion && (
        <Modal 
          question={selectedQuestion} 
          onClose={() => setSelectedQuestion(null)} 
        />
      )}
    </div>
  );
}

export default App;


