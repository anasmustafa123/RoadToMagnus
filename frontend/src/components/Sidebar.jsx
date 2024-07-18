import React, { useContext } from "react";
import styles from "../styles/Sidebar.module.css";
import { UserContext } from "../contexts/UserContext";
export default function Sidebar() {
  const { setUiTheme, uiTheme } = useContext(UserContext);
  const options = [
    {
      icon: "bx bxs-user",
      header: "Profile",
      inlineStyles: { "--hover-color": "rgb(129, 253, 6)" },
    },
    {
      icon: "bx bxl-graphql",
      header: "Games",
      inlineStyles: { "--hover-color": "rgb(129, 253, 6)" },
    },
    {
      icon: "bx bxs-chess",
      header: "Explorer",
      inlineStyles: { "--hover-color": "rgb(129, 253, 6)" },
    },
    {
      icon: "bx bx-stats",
      header: "Stats",
      inlineStyles: { "--hover-color": "rgb(129, 253, 6)" },
    },
    {
      icon: "bx bxs-donate-heart",
      header: "Donate",
      inlineStyles: { marginBottom: "auto", "--hover-color": "red" },
    },
    {
      icon: uiTheme == "light" ? "bx bxs-toggle-left" : "bx bx-toggle-right",
      header: "Mode",
      inlineStyles: { "--hover-color": "rgb(129, 253, 6)" },
    },
    {
      icon: "bx bx-log-out",
      header: "LogOut",
      inlineStyles: { marginBottom: "7.2rem", "--hover-color": "red" },
    },
  ];
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo_container}>
        <img
          draggable={false}
          src="/logos/lichessdotcom.png"
          alt="dashboard logo"
          className={styles.main_logo}
        />
      </div>
      <div className={styles.option_container}>
        {options.map((value, i) => (
          <div
            key={i}
            onClick={() => {
              value.header == "Mode"
                ? setUiTheme(uiTheme == "light" ? "dark" : "light")
                : "";
            }}
            style={value.inlineStyles}
          >
            <i className={value.icon}></i>
            <h2 className={styles.option_name}>{value.header}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
