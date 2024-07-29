import React from 'react';
import styles from '../styles/evaluation.module.css';
import type { Evaluation } from '../types/Game';
const EvaluationBar: React.FC<{ evaluation: Evaluation }> = ({
  evaluation = {type: 'cp', value: 7},
}) => {
  const getScale = (evaluation: Evaluation) => {
    return evaluation.type == 'cp' ? 50.0 + (evaluation.value / 2) * 10 : 0;
  };
  const inlineStyles = {
    height: `${getScale(evaluation)}%`,
  };
  return (
    <>
      <div className={styles.evaluationbar_container}>
        <div className={styles.evaluationText}>{evaluation.value}</div>
        <div className={styles.evaluationbar}>
          <div style={inlineStyles} id={styles.whitebar}></div>
          <div id={styles.blackbar}></div>
        </div>
      </div>
    </>
  );
};
export default EvaluationBar;
