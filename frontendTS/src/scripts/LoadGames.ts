import {
  get_chessDcom_last_date,
  fetch_games_onperiod as fetch_chesscom_games,
} from '../api/chessApiAccess';
import {
  fetchPlayerGames as fetchLichesssGames,
  getUserInfo,
} from '../api/lichessApiAccess';
import { Vendor } from '../types/Api';
import { Game } from '../types/Game';
import { IDB_Game, db } from '../api/Indexed';
import { parsePgn } from './pgn';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const getMissingData = ({
  username,
  afterGameCallback,
  afterGamesCallback,
  vendor,
}: {
  username: string;
  afterGameCallback: (games: Game[]) => void;
  afterGamesCallback: (games: Game[]) => void;
  vendor: Vendor;
}): Promise<{
  ok: boolean;
  games: Game[];
  message?: string;
  missingGames: Game[];
}> => {
  return new Promise((resolve) => {
    console.log(afterGameCallback);
    db.users
      .toArray()
      .then((idb_user) => {
        console.log(idb_user);
        if (!idb_user) {
          resolve({
            ok: false,
            games: [],
            missingGames: [],
            message: 'not a user: missing credentials on indexedDb',
          });
          return;
        }
        db.games.toArray().then((idb_games_res) => {
          let idb_games = idb_games_res
            ?.filter((game) => {
              return game.vendor == vendor;
            })
            .map((idb_game: IDB_Game) => {
              const parsedPgn = parsePgn(idb_game.pgn);
              return {
                ...parsedPgn,
                site: vendor,
                playerColor: parsedPgn.wuser.username == username ? 1 : -1,
              } as Game;
            });

          const idb_date_iso =
            vendor == 'chess.com'
              ? idb_user[0].chessdate
              : idb_user[0].lichessdate;
          const idb_date = idb_date_iso
            ? {
                month: new Date(idb_date_iso).getMonth() + 1,
                year: new Date(idb_date_iso).getFullYear(),
              }
            : { month: null, year: null };
          if (vendor == 'chess.com') {
            get_chessDcom_last_date(username).then((res) => {
              if (!res.ok) {
                resolve({
                  ok: false,
                  games: idb_games,
                  missingGames: [],
                  message: 'error loading chess.com games',
                });
                return;
              }
              let chessDcom_month = res.month;
              let chessDcom_year = res.year;
              fetch_chesscom_games({
                username,
                syear: idb_date.year,
                eyear: chessDcom_year,
                smonth: idb_date.month,
                emonth: chessDcom_month,
                afterEachMonthCallback: afterGameCallback,
              }).then((res) => {
                if (res.ok) {
                  const db_games = res.allGames;
                  resolve({
                    ok: true,
                    missingGames: db_games,
                    games: idb_games ? db_games.concat(idb_games) : db_games,
                  });
                } else {
                  console.warn('no games found on chess.com');
                  resolve({
                    ok: false,
                    games: idb_games,
                    missingGames: [],
                    message: 'no games found on chess.com',
                  });
                }
              });
            });
          } else if (vendor == 'lichess') {
            getUserInfo(username).then((res) => {
              if (!res.ok) {
                resolve({
                  ok: false,
                  games: idb_games,
                  missingGames: [],
                  message: 'error getting lichess user info in fetch request',
                });
                return;
              }
              let lichess_lastseen = res.data.seenAt;
              if (!lichess_lastseen) {
                resolve({
                  ok: false,
                  games: idb_games,
                  missingGames: [],
                  message: 'error loading lichess games',
                });
                return;
              }
              fetchLichesssGames({
                username: 'gg',
                updateGames: afterGameCallback,
                sinceDate:
                  idb_date.month && idb_date.year
                    ? new Date(
                        `${monthNames[idb_date.month - 1]}, ${idb_date.year}`,
                      ).toISOString()
                    : undefined,
              }).then(
                ({
                  ok,
                  games,
                  message,
                }: {
                  ok: boolean;
                  games: Game[];
                  message?: string;
                }) => {
                  if (ok) {
                    afterGamesCallback(games);
                    resolve({
                      ok: true,
                      games: idb_games.concat(games),
                      missingGames: games,
                    });
                    return;
                  } else {
                    console.error(message);
                    afterGamesCallback(games);
                    resolve({
                      ok: false,
                      games: idb_games.concat(games),
                      missingGames: games,
                      message: message,
                    });
                    return;
                  }
                },
              );
            });
          }
        });
      })
      .catch(() => {
        resolve({
          ok: false,
          games: [],
          missingGames: [],
          message: 'not a user: missing credentials on indexedDb',
        });
        return;
      });
  });
};
export { getMissingData };

// check cmonth and userStartdate on both lichess and chess.com
// compare and get the missing data
