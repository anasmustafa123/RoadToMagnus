import React, { useContext, useState } from 'react';
import styles from '../styles/Menubar.module.css';
import { UserContext } from '../contexts/UserContext';
import { Link, useNavigate } from 'react-router-dom';
export default function Sidebar(props: {
  inlineStyles?: React.CSSProperties;
  classNames: string[];
}) {
  const navigate = useNavigate();
  const { setUiTheme, uiTheme, menuBarTheme, setMenuBarTheme, largeScreen } =
    useContext(UserContext);
  const options = [
    {
      icon: 'bx bxs-user',
      header: 'Profile',
      inlineStyles: { '--hover-color': 'rgb(129, 253, 6)' },
    },
    {
      icon: 'bx bxl-graphql',
      header: 'Games',
      inlineStyles: { '--hover-color': 'rgb(129, 253, 6)' },
    },
    {
      icon: 'bx bxs-chess',
      header: 'Explorer',
      inlineStyles: { '--hover-color': 'rgb(129, 253, 6)' },
    },
    {
      icon: 'bx bx-stats',
      header: 'Stats',
      inlineStyles: { '--hover-color': 'rgb(129, 253, 6)' },
    },
    {
      url: 'https://ko-fi.com/anasmostafa',
      icon: 'bx bxs-donate-heart',
      header: 'Donate',
      className: 'donate',
      inlineStyles:
        menuBarTheme == 'v' || menuBarTheme == 'mv'
          ? { marginBottom: 'auto', '--hover-color': 'red' }
          : menuBarTheme == 'h'
            ? { '--hover-color': 'red', marginRight: 'auto' }
            : {},
    },
    {
      url: '#',
      icon: uiTheme == 'light' ? 'bx bxs-toggle-left' : 'bx bx-toggle-right',
      header: 'Mode',
      inlineStyles: { '--hover-color': 'rgb(129, 253, 6)' },
    },
    {
      url: '#',
      icon: 'bx bx-log-out',
      header: 'LogOut',
      className: 'logout',
      inlineStyles:
        menuBarTheme == 'v' || menuBarTheme == 'mv'
          ? { marginBottom: '7.2rem', '--hover-color': 'red' }
          : menuBarTheme == 'h'
            ? { '--hover-color': 'red' }
            : {},
    },
  ];

  return (
    <div
      className={props.classNames.reduce((p, c, i, arr) => {
        console.debug({ p });
        console.debug({ c });
        return !p.length ? styles[c] : p + ' ' + styles[c];
      }, '')}
      style={props.inlineStyles}
    >
      <div className={styles.logo_container}>
        <div
          onClick={() => {
            if (menuBarTheme == 'v') {
              setMenuBarTheme('mv');
            } else if (menuBarTheme == 'mv') {
              setMenuBarTheme('v');
            }
          }}
          className={styles.changeThemeButton}
        >
          {menuBarTheme == 'v' ? (
            <i className="bx bx-chevrons-left"></i>
          ) : menuBarTheme == 'mv' ? (
            <i className="bx bx-chevrons-right"></i>
          ) : (
            ''
          )}
        </div>
        <img
          draggable={false}
          src="/logos/lichessdotcom.png"
          alt="dashboard logo"
          className={styles.main_logo}
        />
      </div>
      <div className={styles.option_container}>
        {options.map((value, i) => (
          <Link
            to={value.url ? value.url : `/${value.header}`}
            key={i}
            onClick={async () => {
              if (value.header.toLowerCase() == 'logout') {
                fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/logout`, {
                  method: 'POST',
                  credentials: 'include',
                })
                  .then(async () => {
                    //let res = await logout();
                  })
                  .catch((e) => {
                    navigate('/login');
                  });
              }
              value.header == 'Mode'
                ? setUiTheme(uiTheme == 'light' ? 'dark' : 'light')
                : '';
            }}
            className={value.className ? styles[value.className] : ''}
            style={value.inlineStyles}
          >
            {/*  <Link to={'/gg'}>link</ Link> */}
            <i className={value.icon}></i>
            <h2 className={styles.option_name}>{value.header}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
