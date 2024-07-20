import styles from '../styles/Profile.module.css';
import { Header } from '../components/profile/Header';
const Profile = () => {
  return ( 
    <>
      <div className={styles.profile}>  
        <Header styles= {styles}></Header>
        <div className={styles.ministats}>afs</div>
        <div className={styles.gameCount}>afs</div>
      </div>
    </>
  );
};

export default Profile;
