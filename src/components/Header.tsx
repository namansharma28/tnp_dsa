import styles from './Header.module.css';

interface HeaderProps {
  activeTab: 'home' | 'dsa' | 'aptitude';
  onTabChange: (tab: 'home' | 'dsa' | 'aptitude') => void;
}

const Header = ({ activeTab, onTabChange }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <img src="/tnp_logo.jpg" alt="T&P Cell Logo" className={styles.logo} />
          <div className={styles.brandText}>
            <span className={styles.deptName}>Training & Placement Cell</span>
            <span className={styles.universityName}>RGPV, Bhopal</span>
          </div>
        </div>

        <nav className={styles.navbar}>
          <button
            className={`${styles.navLink} ${activeTab === 'home' ? styles.active : ''}`}
            onClick={() => onTabChange('home')}
          >
            Home
          </button>
          <button
            className={`${styles.navLink} ${activeTab === 'dsa' ? styles.active : ''}`}
            onClick={() => onTabChange('dsa')}
          >
            DSA
          </button>
          <button
            className={`${styles.navLink} ${activeTab === 'aptitude' ? styles.active : ''}`}
            onClick={() => onTabChange('aptitude')}
          >
            Aptitude
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
