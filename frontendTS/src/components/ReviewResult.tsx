import { useContext } from 'react';
import styles from '../styles/ReviewResult.module.css';
import { ReviewGameContext } from '../contexts/ReviewGameContext';
import { Classification, classificationInfo } from '../types/Review';
export default function ReviewResult() {
  const { gameInfo, movesClassifications } = useContext(ReviewGameContext);

 
  return (
    <div className={styles.reviewResult}>
      <div className={styles.reviewHeader}>
        <div
          style={{ position: 'relative', right: '10%' }}
          className={styles.userInfo}
        >
          <div>{gameInfo.wuser.username}</div>
          <div
            style={
              gameInfo.gameResult == 1
                ? { color: 'var(--win-color)' }
                : { color: 'var(--loss-color)' }
            }
            className={styles.imgContainer}
          >
            <img src={`${gameInfo.wuser.avatar}/user.svg`} alt="black avatar" />
          </div>
          <div
            style={
              gameInfo.gameResult == 1
                ? {
                    '--block-border': `var(--win-color)`,
                  }
                : {
                    '--block-border': `var(--loss-color)`,
                  }
            }
            className={`${styles.wblock} ${styles.block}`}
          >
            {gameInfo.waccuracy}
          </div>
        </div>
        <div
          style={{ position: 'relative', left: '10%' }}
          className={styles.userInfo}
        >
          <div>{gameInfo.buser.username}</div>
          <div
            style={
              gameInfo.gameResult == -1
                ? { color: 'var(--win-color)' }
                : { color: 'var(--loss-color)' }
            }
            className={styles.imgContainer}
          >
            <img src={`${gameInfo.buser.avatar}/user.svg`} alt="black avatar" />
          </div>
          <div
            style={
              gameInfo.gameResult == -1
                ? {
                    '--block-border': `var(--win-color)`,
                  }
                : {
                    '--block-border': `var(--loss-color)`,
                  }
            }
            className={`${styles.bblock} ${styles.block}`}
          >
            {gameInfo.baccuracy}
          </div>
        </div>
      </div>
      <div className={styles.ReviewContainer}>
        {classificationInfo.map((classification, i) =>
          classification.name != 'unknown' ? (
            <div
              style={{
                color: `${classification.color}`,
              }}
              className={styles.line}
              key={i}
            >
              <div className={styles.wClassi}>
                {movesClassifications[classification.name][0]}
              </div>
              <img
                src={`/classification/${classification.name}.png`}
                alt={`${classification.name} chessmove`}
              />
              <div
                style={{
                  color: classification.color,
                }}
                className={styles.bClassi}
              >
                {movesClassifications[classification.name][1]}
              </div>
            </div>
          ) : (
            <></>
          ),
        )}
      </div>
      <div>
        <div className={`${styles.line} ${styles.reviewStatics}`}>
          <div
            style={
              gameInfo.gameResult == 1
                ? {
                    '--block-border': `var(--win-color)`,
                  }
                : {
                    '--block-border': `var(--loss-color)`,
                  }
            }
            className={`${styles.wblock} ${styles.block}`}
          >
            {gameInfo.wuser.rating}
          </div>
          <div className={styles.reviewTitle}>Game Rating</div>
          <div
            style={
              gameInfo.gameResult == -1
                ? {
                    '--block-border': `var(--win-color)`,
                  }
                : {
                    '--block-border': `var(--loss-color)`,
                  }
            }
            className={`${styles.bblock} ${styles.block}`}
          >
            {gameInfo.buser.rating}
          </div>
        </div>
        <div className={`${styles.line} ${styles.reviewStatics}`}>
          <img src="/classification/good.png" alt="" />
          <div className={styles.reviewTitle}>Opening</div>
          <img src="/classification/good.png" alt="" />
        </div>
        <div className={`${styles.line} ${styles.reviewStatics}`}>
          <img src="/classification/good.png" alt="" />
          <div className={styles.reviewTitle}>Middle Game</div>
          <img src="/classification/good.png" alt="" />
        </div>
        <div className={`${styles.line} ${styles.reviewStatics}`}>
          <img src="/classification/good.png" alt="" />
          <div className={styles.reviewTitle}>End Game</div>
          <img src="/classification/good.png" alt="" />
        </div>
      </div>
    </div>
  );
}
