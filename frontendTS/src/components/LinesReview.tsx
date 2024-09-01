import { useContext } from 'react';
import { ReviewGameContext } from '../contexts/ReviewGameContext';
import styles from '../styles/LinesReview.module.css';
export default function LinesReview() {
  const { moves } = useContext(ReviewGameContext);
  const bgColors = ['#fffefe', '#efefef'];

  /*  const getClassification = (classiSym) => {
    for (let key in classificationInfo) {
      if (classificationInfo[key].sym == classiSym) {
        return key;
      }
    }
  }; */
  return (
    <div>
      {moves.map((move, i) =>
        !(i % 2) ? (
          <div
            style={{ backgroundColor: `${bgColors[(i / 2 + 1) % 2]}` }}
            key={`${move.san}-${move.lan}-${move.to}`}
            className={styles.movesContainer}
          >
            <span className={styles.move_index}>{i / 2 + 1}.</span>
            <span className={styles.move_detail}>
              <img src="/classification/good.png" alt="" />
              <img src="/timeControl/blitz.svg" alt="" />
              <span>{move.san}</span>
            </span>
            {moves[i + 1] ? (
              <span className={styles.move_detail}>
                <img src="/classification/good.png" alt="" />
                <img src="/timeControl/blitz.svg" alt="" />
                <span>{moves[i + 1].san}</span>
              </span>
            ) : (
              <></>
            )}
          </div>
        ) : (
          ''
        ),
      )}
    </div>
  );
}
