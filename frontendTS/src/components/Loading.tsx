import React, { CSSProperties } from 'react';
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
import '../styles/react_circular_progressbar.css';
const Loading: React.FC<{
  perc: number;
  message: string;
  maxValue: number;
  inlineStyling: CSSProperties;
}> = ({ perc, message, maxValue, inlineStyling }) => {
  return (
    <>
      <div style={inlineStyling}>
        <CircularProgressbarWithChildren
          value={perc}
          styles={buildStyles({
            textColor: 'green',
            trailColor: 'grey',
            pathColor: 'gold',
          })}
          maxValue={maxValue}
        >
          {/* Put any TSX content in here that you'd like. It'll be vertically and horizonally centered. */}
          <i
            style={{ fontSize: '50px', color: 'var(--text-color)' }}
            className="bx bx-search-alt bx-spin"
          ></i>
          {/* <div style={{ fontSize: 15, marginTop: 5, textAlign: "center" }}>
            <strong>{message}</strong>
          </div> */}
        </CircularProgressbarWithChildren>
      </div>
    </>
  );
};
export default Loading;
