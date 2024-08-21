import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/RouteLink.module.css';
const RouteLink: React.FC<{
  pathUrl: string;
  iconKey: string;
  title: string;
  hovercolor: string;
}> = ({ pathUrl, iconKey, title, hovercolor }) => {
  const [isHovered, setisHovered] = useState(false);
  return (
    <Link // @ts-ignore
      to={pathUrl}
      className={styles.pagelinkContainer}
    >
      <i
        onMouseEnter={() => {
          console.log('entered');
          setisHovered(true);
        }}
        onMouseLeave={() => {
          setisHovered(false);
        }}
        style={{ color: isHovered ? `${hovercolor}` : `` }}
        className={`bx ${iconKey}`}
      ></i>
      <div
        onMouseEnter={() => {
          console.log('entered');
          setisHovered(true);
        }}
        onMouseLeave={() => {
          setisHovered(false);
        }}
        style={{ color: isHovered ? `${hovercolor}` : `` }}
        className={styles.pagelink}
      >
        {title}
      </div>
      <i
        onMouseEnter={() => {
          console.log('entered');
          setisHovered(true);
        }}
        onMouseLeave={() => {
          setisHovered(false);
        }}
        style={{ color: isHovered ? `${hovercolor}` : `` }}
        className="bx bxs-chevron-down"
      ></i>
    </Link>
  );
};

export default RouteLink;
