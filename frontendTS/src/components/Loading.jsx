import React from "react";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "../styles/react_circular_progressbar.css"
export default function Loading({perc, message, maxValue, inlineStyling}) {
  return (
    <>
      <div style={inlineStyling}>
        <CircularProgressbarWithChildren
          value={perc}
          styles={buildStyles({
            textColor: "green",
            trailColor: "grey",
            pathColor: "gold",
          })}
          maxValue={maxValue}
        >
          {/* Put any JSX content in here that you'd like. It'll be vertically and horizonally centered. */}
          <i style={{fontSize: "50px"}} class='bx bx-search-alt bx-spin' ></i>
          {/* <div style={{ fontSize: 15, marginTop: 5, textAlign: "center" }}>
            <strong>{message}</strong>
          </div> */}
        </CircularProgressbarWithChildren>
      </div>
    </>
  );
}
