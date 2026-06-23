import styles from './Header.module.css';

const Header = () => {
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
        <div className={styles.badgeWrapper}>
          <span className={styles.portalBadge}>DSA Practice Portal</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
