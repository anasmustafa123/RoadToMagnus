import React, { useState, useContext } from 'react';
import styles from '../styles/ReviewResult.module.css';
import { ReviewGameContext } from '../contexts/ReviewGameContext';
import { ClassificationScores, Classification } from '../types/Review';

export default function ReviewResult() {
  const { gameInfo, getClassification, moves, classifications } =
    useContext(ReviewGameContext);

  const [movesClassifications, setMovesClassifications] =
    useState<ClassificationScores>({
      book: [0, 0],
      brilliant: [0, 0],
      great: [0, 0],
      best: [0, 0],
      excellent: [0, 0],
      good: [0, 0],
      inaccuracy: [0, 0],
      mistake: [0, 0],
      missed: [0, 0],
      forced: [0, 0],
      blunder: [0, 0],
      botezgambit: [0, 0],
      unknown: [0, 0],
    });

  const countClassifications = (classifications: Classification[]) => {
    let temp: ClassificationScores = { ...movesClassifications };
    classifications.forEach((classification: Classification, i) => {
      !(i % 2)
        ? temp[classification.name][0]++
        : temp[classification.name][1]++;
    });
    console.log(temp);
    setMovesClassifications(temp);
  };

  const classificationInfo: Classification[] = [
    { name: 'book', color: '#72c3a6', sym: '!$' },
    { name: 'brilliant', color: '#00989dba', sym: '$$' },
    { name: 'great', color: '#185fb5d9', sym: '$' },
    { name: 'best', color: '#509d00', sym: '=$$' },
    { name: 'excellent', color: '#5caa0b', sym: '!!' },
    { name: 'good', color: '#768c51', sym: '!' },
    { name: 'forced', color: '#7c9f89', sym: '==' },
    { name: 'inaccuracy', color: '#ff9800', sym: '?!' },
    { name: 'mistake', color: '#e3786a', sym: '?' },
    { name: 'blunder', color: '#ff0909', sym: '??' },
    { name: 'missed', color: '#da3f2a', sym: '?$' },
    { name: 'botezgambit', color: '#5c5c5c', sym: '????' },
    { name: 'unknown', color: '#5c5c5c', sym: '????' },
  ];
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
        {classificationInfo.map((classification, i) => (
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
        ))}
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
