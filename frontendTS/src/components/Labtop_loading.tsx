import { useContext, useEffect, useState } from 'react';
import Loading from './Loading';
import styles from '../styles/NewReview.module.css';
import { ReviewGameContext } from '../contexts/ReviewGameContext';
import { EngineLine } from '../types/Game';

export default function Loading_Review_LargeScreen() {
  const [engineRes, setEngineRes] = useState<EngineLine[]>([]);
  useEffect(() => {
    if (engineRes) {
      console.log({ engineRes });
    }
  }, [engineRes]);
  const { gameInfo, currentPerc, maxPerc } = useContext(ReviewGameContext);
  const message =
    'calculating\t                                                                                                                                                                                                                                                                                                                                                                                                                                            variations...';
  const depth = 18;
  return (
    <>
      <div className={styles.newReview}>
        <div className={styles.header}>Game Review</div>
        <div className={styles.line}>
          <div
            style={
              gameInfo.gameResult == 1
                ? { borderColor: 'var(--win-color)' }
                : { borderColor: 'var(--loss-color)' }
            }
            className={styles.wrating}
          >
            {gameInfo.wuser.rating}
          </div>
          <div className={styles.gameResult}>
            {gameInfo.gameResult == 0
              ? '1/2 - 1/2'
              : gameInfo.gameResult == 1
                ? '1 - 0'
                : '0 : 1'}
          </div>
          <div
            style={
              gameInfo.gameResult == -1
                ? { borderColor: 'var(--win-color)' }
                : { borderColor: 'var(--loss-color)' }
            }
            className={styles.brating}
          >
            {gameInfo.buser.rating}
          </div>
        </div>
        <div>
          <Loading
            message={message}
            maxValue={maxPerc}
            perc={currentPerc}
            inlineStyling={{
              width: '120px',
              alignSelf: 'center',
              margin: 'auto',
            }}
          ></Loading>
        </div>
        <div
          style={{
            textAlign: 'center',
            fontSize: '1.3rem',
            color: 'var(--comment-color)',
          }}
        >{`depth = ${depth}`}</div>
      </div>
    </>
  );
}
