import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import QuestionCard from './components/QuestionCard';
import Filters from './components/Filters';
import Pagination from './components/Pagination';
import Modal from './components/Modal';
import AptitudeModal from './components/AptitudeModal';
import type { Question, AptitudeQuestion, Notice } from './types';
import { parseCSV, parseNoticesCSV, parseAptitudeCSV } from './utils/csvParser';
import styles from './App.module.css';

const ITEMS_PER_PAGE = 12;

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'dsa' | 'aptitude'>('home');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [aptitudeQuestions, setAptitudeQuestions] = useState<AptitudeQuestion[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state for DSA
  const [dsaSearch, setDsaSearch] = useState('');
  const [debouncedDsaSearch, setDebouncedDsaSearch] = useState('');
  const [dsaDifficulty, setDsaDifficulty] = useState('');
  const [dsaTopic, setDsaTopic] = useState('');
  const [dsaPage, setDsaPage] = useState(1);
  const [revisionMode, setRevisionMode] = useState(false);

  // Filters state for Aptitude
  const [aptSearch, setAptSearch] = useState('');
  const [debouncedAptSearch, setDebouncedAptSearch] = useState('');
  const [aptTopic, setAptTopic] = useState('');
  const [aptPage, setAptPage] = useState(1);

  // Selected question modal
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [selectedAptitudeQuestion, setSelectedAptitudeQuestion] = useState<AptitudeQuestion | null>(null);

  // Persistent user progress states
  const [solvedDsa, setSolvedDsa] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rgpv_solved_dsa');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [solvedAptitude, setSolvedAptitude] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rgpv_solved_aptitude');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookmarkedDsa, setBookmarkedDsa] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rgpv_bookmarked_dsa');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('rgpv_solved_dsa', JSON.stringify(solvedDsa));
  }, [solvedDsa]);

  useEffect(() => {
    localStorage.setItem('rgpv_solved_aptitude', JSON.stringify(solvedAptitude));
  }, [solvedAptitude]);

  useEffect(() => {
    localStorage.setItem('rgpv_bookmarked_dsa', JSON.stringify(bookmarkedDsa));
  }, [bookmarkedDsa]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDsaSearch(dsaSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [dsaSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAptSearch(aptSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [aptSearch]);

  // Load CSV data dynamically
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [qRes, aptRes, noticeRes] = await Promise.all([
          fetch('/questions.csv'),
          fetch('/aptitude.csv'),
          fetch('/notices.csv'),
        ]);
        const [qText, aptText, noticeText] = await Promise.all([
          qRes.text(),
          aptRes.text(),
          noticeRes.text(),
        ]);

        setQuestions(parseCSV(qText));
        setAptitudeQuestions(parseAptitudeCSV(aptText));
        setNotices(parseNoticesCSV(noticeText));
      } catch (error) {
        console.error('Error loading CSV placement curriculum data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Event handlers
  const toggleSolvedDsa = (id: string) => {
    setSolvedDsa((prev) =>
      prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]
    );
  };

  const toggleSolvedAptitude = (id: string) => {
    setSolvedAptitude((prev) =>
      prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]
    );
  };

  const toggleBookmarkDsa = (id: string) => {
    setBookmarkedDsa((prev) =>
      prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]
    );
  };

  // Get unique topics dynamically from CSV
  const dsaTopics = useMemo(() => {
    const topicSet = new Set<string>();
    questions.forEach((q) => {
      q.topics.split('|').forEach((topic) => topicSet.add(topic.trim()));
    });
    return Array.from(topicSet).sort();
  }, [questions]);

  const aptitudeTopics = useMemo(() => {
    const topicSet = new Set<string>();
    aptitudeQuestions.forEach((q) => {
      q.topics.split('|').forEach((topic) => topicSet.add(topic.trim()));
    });
    return Array.from(topicSet).sort();
  }, [aptitudeQuestions]);

  const difficulties = ['Easy', 'Medium', 'Hard'];

  // Stats calculation
  const dsaStats = useMemo(() => {
    const total = questions.length;
    const solved = questions.filter((q) => solvedDsa.includes(q.id)).length;

    const easyTotal = questions.filter((q) => q.difficulty === 'Easy').length;
    const easySolved = questions.filter(
      (q) => q.difficulty === 'Easy' && solvedDsa.includes(q.id)
    ).length;

    const mediumTotal = questions.filter((q) => q.difficulty === 'Medium').length;
    const mediumSolved = questions.filter(
      (q) => q.difficulty === 'Medium' && solvedDsa.includes(q.id)
    ).length;

    const hardTotal = questions.filter((q) => q.difficulty === 'Hard').length;
    const hardSolved = questions.filter(
      (q) => q.difficulty === 'Hard' && solvedDsa.includes(q.id)
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
  }, [questions, solvedDsa]);

  const aptStats = useMemo(() => {
    const total = aptitudeQuestions.length;
    const solved = aptitudeQuestions.filter((q) => solvedAptitude.includes(q.id)).length;
    const percent = total > 0 ? Math.round((solved / total) * 100) : 0;
    return { total, solved, percent };
  }, [aptitudeQuestions, solvedAptitude]);

  // Filtering DSA
  const filteredDsaQuestions = useMemo(() => {
    return questions.filter((question) => {
      // Revision bookmark filter
      if (revisionMode && !bookmarkedDsa.includes(question.id)) {
        return false;
      }

      const matchesSearch =
        debouncedDsaSearch === '' ||
        question.title.toLowerCase().includes(debouncedDsaSearch.toLowerCase()) ||
        question.topics.toLowerCase().includes(debouncedDsaSearch.toLowerCase());

      const matchesDifficulty =
        dsaDifficulty === '' || question.difficulty === dsaDifficulty;

      const matchesTopic =
        dsaTopic === '' || question.topics.split('|').map(t => t.trim()).includes(dsaTopic);

      return matchesSearch && matchesDifficulty && matchesTopic;
    });
  }, [questions, debouncedDsaSearch, dsaDifficulty, dsaTopic, revisionMode, bookmarkedDsa]);

  // Filtering Aptitude (Aptitude questions don't show difficulty field)
  const filteredAptQuestions = useMemo(() => {
    return aptitudeQuestions.filter((question) => {
      const matchesSearch =
        debouncedAptSearch === '' ||
        question.title.toLowerCase().includes(debouncedAptSearch.toLowerCase()) ||
        question.topics.toLowerCase().includes(debouncedAptSearch.toLowerCase());

      const matchesTopic =
        aptTopic === '' || question.topics.split('|').map(t => t.trim()).includes(aptTopic);

      return matchesSearch && matchesTopic;
    });
  }, [aptitudeQuestions, debouncedAptSearch, aptTopic]);

  // Pagination for DSA
  const dsaTotalPages = Math.ceil(filteredDsaQuestions.length / ITEMS_PER_PAGE);
  const paginatedDsaQuestions = useMemo(() => {
    const start = (dsaPage - 1) * ITEMS_PER_PAGE;
    return filteredDsaQuestions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDsaQuestions, dsaPage]);

  // Pagination for Aptitude
  const aptTotalPages = Math.ceil(filteredAptQuestions.length / ITEMS_PER_PAGE);
  const paginatedAptQuestions = useMemo(() => {
    const start = (aptPage - 1) * ITEMS_PER_PAGE;
    return filteredAptQuestions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAptQuestions, aptPage]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading placement curriculum...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />



      <main className={styles.main}>
        {/* VIEW 1: HOME VIEW */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.heroTagline}>Training & Placement Cell, RGPV</span>
            <h1 className={styles.heroTitle}>Preparation for Placement</h1>
            <p className={styles.heroDescription}>
              Welcome to the official Curated DSA and Aptitude Practice Portal. Solve hand-picked data structures and algorithms questions selected by placement cell officers to sharpen your skills and excel in company recruitment exams.
            </p>
          </div>
          <div className={styles.heroVisual}>
            <img src="/tnp_logo.jpg" alt="T&P Cell RGPV" className={styles.heroImage} />
          </div>
        </section>
        {activeTab === 'home' && (
          <div className={styles.homeLayout}>
            {/* PROGRESS CARDS: Two cards below notices taking half-half area */}
            <div className={styles.progressRow}>
              {/* Prepare for DSA Card */}
              <div className={styles.prepCard}>
                <div className={styles.prepHeader}>
                  <h3 className={styles.prepCardTitle}>Prepare for DSA</h3>
                  <span className={styles.prepPercent}>{dsaStats.percent}%</span>
                </div>

                <div className={styles.prepProgressWrapper}>
                  <div
                    className={styles.prepProgressBar}
                    style={{ width: `${dsaStats.percent}%` }}
                  ></div>
                </div>

                <div className={styles.prepInfo}>
                  <span>Solved {dsaStats.solved} of {dsaStats.total} Questions</span>
                  <button
                    onClick={() => setActiveTab('dsa')}
                    className={styles.prepButton}
                  >
                    Practice DSA →
                  </button>
                </div>
              </div>

              {/* Prepare for Aptitude Card */}
              <div className={styles.prepCard}>
                <div className={styles.prepHeader}>
                  <h3 className={styles.prepCardTitle}>Prepare for Aptitude</h3>
                  <span className={styles.prepPercent}>{aptStats.percent}%</span>
                </div>

                <div className={styles.prepProgressWrapper}>
                  <div
                    className={styles.prepProgressBar}
                    style={{ width: `${aptStats.percent}%` }}
                  ></div>
                </div>

                <div className={styles.prepInfo}>
                  <span>Solved {aptStats.solved} of {aptStats.total} Questions</span>
                  <button
                    onClick={() => setActiveTab('aptitude')}
                    className={styles.prepButton}
                  >
                    Practice Aptitude →
                  </button>
                </div>
              </div>
            </div>
            <section className={styles.noticeSection}>
              <div className={styles.noticeBoard}>
                <div className={styles.noticeHeader}>
                  <div className={styles.noticePulse}></div>
                  <h2 className={styles.noticeTitle}>Placement Notices & Notice Board</h2>
                </div>

                {notices.length > 0 ? (
                  <div className={styles.noticeList}>
                    {notices.map((notice, index) => (
                      <a
                        key={index}
                        href={notice.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.noticeCard}
                      >
                        <div className={styles.noticeCardHeader}>
                          <svg className={styles.noticeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                          <span className={styles.noticeBadge}>Latest Announcement</span>
                        </div>
                        <h3 className={styles.noticeCardTitle}>{notice.title}</h3>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyNotices}>
                    <p>No recent announcements posted. Check back later.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: DSA CURRICULUM VIEW */}
        {activeTab === 'dsa' && (
          <div className={styles.dsaLayout}>
            {/* Dashboard Progress Panel */}
            <section className={styles.dashboard}>
              <div className={styles.dashboardCard}>
                <div className={styles.dashboardHeader}>
                  <div>
                    <h2 className={styles.dashboardTitle}>DSA Preparation Progress</h2>
                    <p className={styles.dashboardSubtitle}>Track your placement readiness</p>
                  </div>
                  <span className={styles.dashboardPercent}>{dsaStats.percent}% Solved</span>
                </div>

                <div className={styles.progressBarWrapper}>
                  <div
                    className={styles.progressBar}
                    style={{ width: `${dsaStats.percent}%` }}
                  ></div>
                </div>

                <div className={styles.statsGrid}>
                  <div className={styles.statBox}>
                    <span className={styles.statLabel}>Total Solved</span>
                    <span className={styles.statValue}>{dsaStats.solved} <span className={styles.statSlash}>/ {dsaStats.total}</span></span>
                  </div>
                  <div className={`${styles.statBox} ${styles.statEasy}`}>
                    <span className={styles.statLabel}>Easy</span>
                    <span className={styles.statValue}>{dsaStats.easySolved} <span className={styles.statSlash}>/ {dsaStats.easyTotal}</span></span>
                  </div>
                  <div className={`${styles.statBox} ${styles.statMedium}`}>
                    <span className={styles.statLabel}>Medium</span>
                    <span className={styles.statValue}>{dsaStats.mediumSolved} <span className={styles.statSlash}>/ {dsaStats.mediumTotal}</span></span>
                  </div>
                  <div className={`${styles.statBox} ${styles.statHard}`}>
                    <span className={styles.statLabel}>Hard</span>
                    <span className={styles.statValue}>{dsaStats.hardSolved} <span className={styles.statSlash}>/ {dsaStats.hardTotal}</span></span>
                  </div>
                </div>
              </div>
            </section>

            {/* Filters */}
            <Filters
              topics={dsaTopics}
              difficulties={difficulties}
              selectedTopic={dsaTopic}
              selectedDifficulty={dsaDifficulty}
              searchQuery={dsaSearch}
              onTopicChange={(topic) => {
                setDsaTopic(topic);
                setDsaPage(1);
              }}
              onDifficultyChange={(difficulty) => {
                setDsaDifficulty(difficulty);
                setDsaPage(1);
              }}
              onSearchChange={(query) => {
                setDsaSearch(query);
                setDsaPage(1);
              }}
              revisionMode={revisionMode}
              onRevisionToggle={() => {
                setRevisionMode(!revisionMode);
                setDsaPage(1);
              }}
            />

            {/* Questions Grid Section */}
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>DSA Practice Questions</h2>
                <p className={styles.sectionDescription}>
                  Showing {filteredDsaQuestions.length} of {questions.length} question{filteredDsaQuestions.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {paginatedDsaQuestions.length > 0 ? (
              <>
                <div className={styles.grid}>
                  {paginatedDsaQuestions.map((question) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      isSolved={solvedDsa.includes(question.id)}
                      isBookmarked={bookmarkedDsa.includes(question.id)}
                      onToggleSolved={(e) => {
                        e.stopPropagation();
                        toggleSolvedDsa(question.id);
                      }}
                      onToggleBookmark={(e) => {
                        e.stopPropagation();
                        toggleBookmarkDsa(question.id);
                      }}
                      onClick={() => setSelectedQuestion(question)}
                    />
                  ))}
                </div>

                {dsaTotalPages > 1 && (
                  <Pagination
                    currentPage={dsaPage}
                    totalPages={dsaTotalPages}
                    onPageChange={setDsaPage}
                  />
                )}
              </>
            ) : (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>📂</div>
                <h3 className={styles.emptyTitle}>
                  {revisionMode ? "No revision items bookmarked" : "No matching questions"}
                </h3>
                <p className={styles.emptyDescription}>
                  {revisionMode
                    ? "Bookmark questions by clicking the icon on card corners to review them later."
                    : "Adjust your keyword searches or dropdown filters."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: APTITUDE CURRICULUM VIEW */}
        {activeTab === 'aptitude' && (
          <div className={styles.aptitudeLayout}>
            {/* Dashboard Progress Panel (Aptitude has no difficulty-wise stats!) */}
            <section className={styles.dashboard}>
              <div className={styles.dashboardCard}>
                <div className={styles.dashboardHeader}>
                  <div>
                    <h2 className={styles.dashboardTitle}>Aptitude Preparation Progress</h2>
                    <p className={styles.dashboardSubtitle}>Track your placement readiness</p>
                  </div>
                  <span className={styles.dashboardPercent}>{aptStats.percent}% Solved</span>
                </div>

                <div className={styles.progressBarWrapper}>
                  <div
                    className={styles.progressBar}
                    style={{ width: `${aptStats.percent}%` }}
                  ></div>
                </div>

                <div className={styles.statsGrid}>
                  <div className={styles.statBox} style={{ gridColumn: 'span 4' }}>
                    <span className={styles.statLabel}>Total Topics Completed</span>
                    <span className={styles.statValue}>{aptStats.solved} <span className={styles.statSlash}>/ {aptStats.total}</span></span>
                  </div>
                </div>
              </div>
            </section>

            {/* Filters (No difficulty dropdown filter for Aptitude!) */}
            <Filters
              topics={aptitudeTopics}
              difficulties={[]} // Empty array removes difficulty dropdown inside Filters.tsx!
              selectedTopic={aptTopic}
              selectedDifficulty=""
              searchQuery={aptSearch}
              onTopicChange={(topic) => {
                setAptTopic(topic);
                setAptPage(1);
              }}
              onDifficultyChange={() => { }}
              onSearchChange={(query) => {
                setAptSearch(query);
                setAptPage(1);
              }}
            />

            {/* Questions Grid Section */}
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Aptitude Prep Questions</h2>
                <p className={styles.sectionDescription}>
                  Showing {filteredAptQuestions.length} of {aptitudeQuestions.length} topic{filteredAptQuestions.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {paginatedAptQuestions.length > 0 ? (
              <>
                <div className={styles.grid}>
                  {paginatedAptQuestions.map((question) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      isSolved={solvedAptitude.includes(question.id)}
                      onToggleSolved={(e) => {
                        e.stopPropagation();
                        toggleSolvedAptitude(question.id);
                      }}
                      onClick={() => setSelectedAptitudeQuestion(question)}
                    />
                  ))}
                </div>

                {aptTotalPages > 1 && (
                  <Pagination
                    currentPage={aptPage}
                    totalPages={aptTotalPages}
                    onPageChange={setAptPage}
                  />
                )}
              </>
            ) : (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>🔍</div>
                <h3 className={styles.emptyTitle}>No matching aptitude topics</h3>
                <p className={styles.emptyDescription}>Try adjusting your keywords or topic filter selections.</p>
              </div>
            )}
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

      {/* Modal detail overlay (DSA only) */}
      {selectedQuestion && (
        <Modal
          question={selectedQuestion}
          isSolved={solvedDsa.includes(selectedQuestion.id)}
          onToggleSolved={() => toggleSolvedDsa(selectedQuestion.id)}
          onClose={() => setSelectedQuestion(null)}
        />
      )}

      {/* Modal detail overlay (Aptitude only) */}
      {selectedAptitudeQuestion && (
        <AptitudeModal
          question={selectedAptitudeQuestion}
          isSolved={solvedAptitude.includes(selectedAptitudeQuestion.id)}
          onToggleSolved={() => toggleSolvedAptitude(selectedAptitudeQuestion.id)}
          onClose={() => setSelectedAptitudeQuestion(null)}
        />
      )}
    </div>
  );
}

export default App;
