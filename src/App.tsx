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

  // Solved questions tracking
  const [solvedQuestions, setSolvedQuestions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rgpv_dsa_solved_questions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync solved questions to localStorage
  useEffect(() => {
    localStorage.setItem('rgpv_dsa_solved_questions', JSON.stringify(solvedQuestions));
  }, [solvedQuestions]);

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

  const toggleSolved = (id: string) => {
    setSolvedQuestions((prev) =>
      prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]
    );
  };

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

  // Prep dashboard stats
  const stats = useMemo(() => {
    const total = questions.length;
    const solved = questions.filter((q) => solvedQuestions.includes(q.id)).length;
    
    const easyTotal = questions.filter((q) => q.difficulty === 'Easy').length;
    const easySolved = questions.filter(
      (q) => q.difficulty === 'Easy' && solvedQuestions.includes(q.id)
    ).length;

    const mediumTotal = questions.filter((q) => q.difficulty === 'Medium').length;
    const mediumSolved = questions.filter(
      (q) => q.difficulty === 'Medium' && solvedQuestions.includes(q.id)
    ).length;

    const hardTotal = questions.filter((q) => q.difficulty === 'Hard').length;
    const hardSolved = questions.filter(
      (q) => q.difficulty === 'Hard' && solvedQuestions.includes(q.id)
    ).length;

    const percent = total > 0 ? Math.round((solved / total) * 100) : 0;

    return {
      total,
      solved,
      easyTotal,
      easySolved,
      mediumTotal,
      mediumSolved,
      hardTotal,
      hardSolved,
      percent,
    };
  }, [questions, solvedQuestions]);

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

        {/* Dashboard Progress Panel */}
        <section className={styles.dashboard}>
          <div className={styles.dashboardCard}>
            <div className={styles.dashboardHeader}>
              <div>
                <h2 className={styles.dashboardTitle}>Preparation Progress</h2>
                <p className={styles.dashboardSubtitle}>Track your individual placement readiness</p>
              </div>
              <span className={styles.dashboardPercent}>{stats.percent}% Solved</span>
            </div>
            
            <div className={styles.progressBarWrapper}>
              <div 
                className={styles.progressBar} 
                style={{ width: `${stats.percent}%` }}
              ></div>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>Total Solved</span>
                <span className={styles.statValue}>{stats.solved} <span className={styles.statSlash}>/ {stats.total}</span></span>
              </div>
              <div className={`${styles.statBox} ${styles.statEasy}`}>
                <span className={styles.statLabel}>Easy</span>
                <span className={styles.statValue}>{stats.easySolved} <span className={styles.statSlash}>/ {stats.easyTotal}</span></span>
              </div>
              <div className={`${styles.statBox} ${styles.statMedium}`}>
                <span className={styles.statLabel}>Medium</span>
                <span className={styles.statValue}>{stats.mediumSolved} <span className={styles.statSlash}>/ {stats.mediumTotal}</span></span>
              </div>
              <div className={`${styles.statBox} ${styles.statHard}`}>
                <span className={styles.statLabel}>Hard</span>
                <span className={styles.statValue}>{stats.hardSolved} <span className={styles.statSlash}>/ {stats.hardTotal}</span></span>
              </div>
            </div>
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
                  isSolved={solvedQuestions.includes(question.id)}
                  onToggleSolved={(e) => {
                    e.stopPropagation();
                    toggleSolved(question.id);
                  }}
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
          isSolved={solvedQuestions.includes(selectedQuestion.id)}
          onToggleSolved={() => toggleSolved(selectedQuestion.id)}
          onClose={() => setSelectedQuestion(null)} 
        />
      )}
    </div>
  );
}

export default App;
