import React, { CSSProperties, useContext, useState } from 'react';
import Game from '../components/Game';
import styles from '../styles/Games.module.css';
import {
  fetchChessGamesonMonth,
  reduceGamesOfMonth as reducechessDC,
} from '../api/chessApiAccess';
import { UserContext } from '../contexts/UserContext';
import { GameContext } from '../contexts/GamesContext';
import { ReviewGameContext } from '../contexts/ReviewGameContext';
import { useNavigate } from 'react-router-dom';
import { addData, init_indexedDb } from '../api/indexedDb';
import { ChessEngine } from '../scripts/_Stockfish';
import { EngineLine } from '../types/Game';
import { getMoves, parsePgn } from '../scripts/pgn';
import { getClassificationScore } from '../scripts/evaluate';
import { Classify } from '../scripts/_Classify';
const Games: React.FC<{ inlineStyles: CSSProperties }> = ({ inlineStyles }) => {
  const { usernameChessDC } = useContext(UserContext);
  const [animation, setanimation] = useState('');
  const {
    setGameInfo,
    setCurrentPerc,
    setClassificationNames,
    setMaxtPerc,
    setsanMoves,
    setEvaluations,
    setCurrentMoveNum,
    setCurrentEngineLines,
    setReviewStatus,
    setEngineResponses,
    setMoves
  } = useContext(ReviewGameContext);
  const { allGames, updateAllGames } = useContext(GameContext);
  const date = new Date();
  const [month, setmonth] = useState(date.getMonth());
  const navigate = useNavigate();
  return (
    <>
      <div className={styles.gamesContainer} style={inlineStyles}>
        <div className={styles.header}>
          <h2>All Games</h2>
          <i
            onClick={() => {
              setanimation('bx-spin');
              setTimeout(() => {
                setanimation('');
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
                    reduced: reducechessDC(
                      'chess.com',
                      usernameChessDC,
                      res.games,
                    ),
                  });
                  updateAllGames(
                    reducechessDC('chess.com', usernameChessDC, res.games),
                  );
                },
              );
            }}
            className={`${animation} bx bx-repost`}
          ></i>
        </div>
        <React.Suspense
          fallback={
            <div className={`${styles.animatedTextCont}`}>
              <div className={styles.animatedTextRight}>Loading Your Games</div>
              <div className={styles.animatedTextLeft}>....Stay Still....</div>
            </div>
          }
        >
          {allGames.map((value, i) => (
            <Game
              onClick={async (gameData) => {
                setGameInfo(gameData);
                setMaxtPerc(gameData.movesCount);
                setGameInfo(gameData);
                let parsedGameData = parsePgn(gameData.pgn);
                let moves = getMoves(gameData.pgn);
                setMoves(moves);
                setsanMoves(parsedGameData.moves);
                setClassificationNames(
                  parsedGameData.classifi.map((c) => c.name),
                );
                setEvaluations(parsedGameData.evaluations);
                let ClassificationHelper = new Classify({
                  sanMoves: parsedGameData.moves,
                  evaluations: parsedGameData.evaluations,
                });

                let stockfish = new ChessEngine(2, 18);
                stockfish._init().then(() => {
                  const afterMoveCallback = async (param: {
                    ok: boolean;
                    sanMove: string;
                    moveNum: number;
                    lines: EngineLine[];
                  }) => {
                    if (param.ok) {
                      let moveClassification =
                        await ClassificationHelper.getMoveClassification({
                          engineResponse: param.lines,
                          moveNum: param.moveNum,
                          plColor: param.moveNum % 2 ? 1 : -1,
                          gameInfo: gameData,
                        });
                      console.log(moveClassification);
                      setClassificationNames((old) => [
                        ...old,
                        moveClassification,
                      ]);

                      //setCurrentMoveNum(param.moveNum);
                      if (param.lines.length == 0) {
                        setReviewStatus(true);
                        return;
                      }
                      if (
                        param.moveNum > 0 &&
                        parsedGameData.moves[param.moveNum - 1] != param.sanMove
                      ) {
                        throw new Error('san moves dont match');
                      }
                      //setCurrentEngineLines(param.lines);
                      //setEngineResponses((old) => [...old, param.lines]);
                      setEvaluations((old) => [
                        ...old,
                        param.lines[0].evaluation,
                      ]);
                      setCurrentPerc((old) => old + 1);
                    }
                  };
                  stockfish.evaluatePosition({
                    pgn: gameData.pgn,
                    afterMoveCallback,
                  });
                });
               // navigate(`/review/:${gameData.gameId}`);
              }}
              key={i}
              gameData={value}
            ></Game>
          ))}
        </React.Suspense>
      </div>
    </>
  );
};

export default Games;
