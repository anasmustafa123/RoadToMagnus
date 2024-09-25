import React, { ReactElement, useContext, useEffect, useRef } from 'react';
import styles from '../styles/ReviewResult.module.css';
import { ReviewGameContext } from '../contexts/ReviewGameContext';
import { classificationInfo } from '../types/Review';
const ReviewResult: React.FC<{
  expand_review_state: boolean;
  children: ReactElement;
}> = ({ expand_review_state, children }) => {
  const { gameInfo, movesClassifications } = useContext(ReviewGameContext);
  const expandstateRef = useRef(null);
  useEffect(() => {
    if (expandstateRef.current) {
      console.log(expandstateRef.current);
      let element = expandstateRef.current as HTMLElement;
      element.className = `${styles.reviewResult_content} ${expand_review_state ? '' : styles.state_is_shrinked}`;
    }
  }, [expand_review_state]);
  return (
    <div className={styles.reviewResult}>
      <div
        ref={expandstateRef}
        className={styles.reviewResult_content + ' ' + styles.state_is_shrinked}
      >
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
              <img src={gameInfo.wuser.avatar || '/white_brain.png'} />
            </div>
            <div
              style={
                gameInfo.gameResult == 1
                  ? {
                      '--block-border': `var(--win-color)`,
                      width: '100%',
                    }
                  : {
                      '--block-border': `var(--loss-color)`,
                      width: '100%',
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
              <img
                src={gameInfo.buser.avatar || '/black_brain.png'}
                alt="black avatar"
              />
            </div>
            <div
              style={
                gameInfo.gameResult == -1
                  ? {
                      '--block-border': `var(--win-color)`,
                      width: '100%',
                    }
                  : {
                      '--block-border': `var(--loss-color)`,
                      width: '100%',
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
                key={`${classification.name}-${Math.round(Math.random() * 1000)}-${classification.color}`}
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
        <div className={styles.gameStatistics}>
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
      {children}
    </div>
  );
};
export default ReviewResult;
