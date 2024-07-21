import React, { useState, useContext } from 'react';
import Loading from './Loading';
import styles from '../styles/NewReview.module.css';
import { GameResult } from '../types/Game';
import { ReviewGameContext } from '../contexts/ReviewGameContext';
export default function NewReview({ perc = 20 }) {
  const { gameInfo } = useContext(ReviewGameContext);
  let largeScreen = false;
  const message =
    'calculating\t                                                                                                                                                                                                                                                                                                                                                                                                                                            variations...';
  const maxValue = 100;
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
            {
              gameInfo.gameResult == 0
                ? '1/2 - 1/2' 
                : gameInfo.gameResult == 1
                  ? '1 - 0'
                  : '0 : 1'
            }
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
            maxValue={maxValue}
            perc={perc}
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
