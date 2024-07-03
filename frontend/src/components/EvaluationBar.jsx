import React from "react";
import styles from "../styles/evaluation.module.css";
export default function EvaluationBar({ evaluation }) {
  const getScale = (evaluation) => {
    return 50.0 + (evaluation / 2) * 10;
  };
  const inlineStyles = {
    height: `${getScale(evaluation)}%`,
  };
  return (
    <>
      <div className={styles.evaluationbar_container}>
        <div className={styles.evaluationText}>{evaluation}</div>
        <div className={styles.evaluationbar}>
          <div style={inlineStyles} id={styles.whitebar}></div>
          <div id={styles.blackbar}></div>
        </div>
      </div>
    </>
  );
}
