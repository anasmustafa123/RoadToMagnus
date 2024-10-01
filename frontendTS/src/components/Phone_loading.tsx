import { useContext } from 'react';
import ChessBoard from './ChessBoard';
import { ReviewGameContext } from '../contexts/ReviewGameContext';
import styles from '../styles/NewReview.module.css';

const Loading_Review_SmallScreen: React.FC = () => {
  const { currentPerc, maxPerc } = useContext(ReviewGameContext);

  return (
    <>
      <div className={styles.Phone_loading_container}>
        <ChessBoard
          inlineStyles={{
            maxWidth: 'fit-content',
          }}
        />
        <progress
          className="progress-bar"
          max={maxPerc}
          value={currentPerc}
          color="green"
          style={{
            marginTop: '0.7rem',
            width: '90%',
            padding: '1.1rem',
          }}
        />
      </div>
    </>
  );
};

export default Loading_Review_SmallScreen;
