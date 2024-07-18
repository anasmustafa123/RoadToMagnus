import React, { useContext, useState } from "react";
import Game from "../components/Game";
import { getMovesNum } from "../scripts/pgn";
import styles from "../styles/Games.module.css";
import {
  fetchChessGamesonMonth as chessDCGamesOMonth,
  fetchChessGamesonMonth,
  getYearAndMonth,
  reduceGamesOfMonth as reducechessDC,
} from "../api/chessApiAccess";
import { UserContext } from "../contexts/UserContext";
import { GameContext } from "../contexts/GamesContext";

export default function Games({ inlineStyles }) {
  const { usernameChessDC, usernameLichess, chessDCAvatarLink, username } =
    useContext(UserContext);
  const [animation, setanimation] = useState("");
  const { allGames, updateAllGames } = useContext(GameContext);
  const date = new Date();
  const [month, setmonth] = useState(date.getMonth());

  return (
    <>
      <div className={styles.gamesContainer} style={inlineStyles}>
        <div className={styles.header}>
          <h2>All Games</h2>
          <i
            onClick={() => {
              setanimation("bx-spin");
              setTimeout(() => {
                setanimation("");
              }, 2000);
              console.log({
                uname: usernameChessDC,
                year: date.getFullYear(),
                month,
              });
              let st = Date.now();
              fetchChessGamesonMonth(usernameChessDC, 2022, month).then(
                (res) => {
                  let end = Date.now();
                  setmonth((old) => old - 1);
                  console.log(`time: ${(end - st) / 1000}sec`);
                  console.log(res);
                  console.log({
                    reduced: reducechessDC("chessdotcom", res.games),
                  });
                  updateAllGames(reducechessDC("chessdotcom", res.games));
                }
              );
            }}
            className={`${animation} bx bx-repost`}
          ></i>
        </div>
        {true ? (
          allGames.map((value, i) => <Game pass={i} data={value}></Game>)
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
