import styles from './footer.module.css';

const Footer = ({}) => {
  return (
    <footer className={styles.footer}>
      <a href="" className={styles.link}><p>Alikhan</p></a>
      <p>-</p>
      <a href="" className={styles.link}><p>Zhartas</p></a>
      <p>-</p>
      <a href="" className={styles.link}><p>Shyntemir</p></a>
      <p>-</p>
      <a href="" className={styles.link}><p>Almaz</p></a>
      <p>-</p>
      <a href="" className={styles.link}><p>Temirlan</p></a>
      <p>-</p>
      <a href="" className={styles.link}><p>Adil</p></a>
    </footer>
  );
}

export default Footer;