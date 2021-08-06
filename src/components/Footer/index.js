import React from 'react';
import styles from './footer.module.scss';


const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.brand}>
      <div className={styles.created}>
      </div>
      <div className={styles.copyright}>
      SWALLOW- The marketplace for digital tattoos 
      </div>
    </div>
  </footer>
)

export default Footer;
