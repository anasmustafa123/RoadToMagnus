import { getMovesNum } from '../scripts/pgn';
import { ChessComGame, Vendor } from '../types/Api';
import type { Game, GameResult, GamesCount, GameType } from '../types/Game';
import { GameTypes } from '../types/Game';
import { GetGameById } from '../../../shared/types/dist';
async function getUserInfo(username: string) {
  const url = `https://api.chess.com/pub/player/${username}`;
  const res = await fetch(url);
  return { ok: res.ok, data: await res.json() };
}

/* async function getPlayerProfileInfo(username) {
  let info = await getUserInfo(username);
  let joinYearMonth = getYearAndMonth(info["joined"]);
  return {
    joinMonth: joinYearMonth.month,
    joinYear: joinYearMonth.year,
    username: username,
    url: info["url"],
  };
} */
const getAvalibleArchieves = async (username: string) => {
  console.log('getAvalibleArchieves');
  const url = `https://api.chess.com/pub/player/${username}/games/archives`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching games: ${response.status}`);
    }
    const data = await response.json();
    console.debug(data);
    console.log(data);
    return data;
  } catch (error) {
    console.error('enter correct chess.com username');
    return null; // Or handle the error differently
  }
};

async function fetchChessGamesonMonth(
  username: string,
  year: number,
  month: number,
) {
  let month_str = month < 10 ? '0' + String(month) : month;
  const url = `https://api.chess.com/pub/player/${username}/games/${year}/${month_str}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching games: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return null; // Or handle the error differently
  }
}

const getGamesOfMonth = async (
  username: string,
  year: number,
  month: number,
) => {
  return new Promise(async (resolve) => {
    //console.log(`get game of month usernamae: ${username}`);
    fetchChessGamesonMonth(username, year, month).then((games) => {
      resolve(reduceGamesOfMonth('chess.com', username, games.games));
    });
  });
};

const reduceGamesOfMonth = (
  vendor: Vendor,
  username: string,
  monthGames: ChessComGame[],
): Game[] => {
  let gamesCount: GamesCount = {
    rapid: 0,
    blitz: 0,
    bullet: 0,
    daily: 0,
  };
  monthGames = monthGames.filter((game, i) => {
    return game.pgn;
  });
  return monthGames.map((game) => {
    console.log(game);
    let _gameId = 0;
    if (game.url) {
      console.log(game.url);
      let res = game.url.split('/');
      let url = '';
      if (res.length > 0) {
        url = res[res.length - 1].slice(0, -1);
        _gameId = parseInt(url);
      }
    }
    let gameResult: GameResult =
      game.black.result.toLowerCase() === 'win['
        ? -1
        : game.white.result.toLowerCase() === 'win'
          ? 1
          : 0;
    let drawType;
    if (!gameResult) {
      drawType =
        game.black.result.toLowerCase() === 'agreed' ||
        game.black.result.toLowerCase() === 'repetition' ||
        game.black.result.toLowerCase() === 'stalemate' ||
        game.black.result.toLowerCase() === 'timevsinsufficient' ||
        game.black.result.toLowerCase() === 'insufficient'
          ? game.black.result.toLowerCase()
          : '';
    }
    const timeClass = GameTypes.find((v) => game.time_class.toLowerCase() == v)
      ? (game.time_class.toLowerCase() as GameType)
      : undefined;
    //console.log(game.time_class.toLowerCase() as GameType);
    timeClass ? (gamesCount[timeClass] = gamesCount[timeClass] + 1) : '';
    //console.log(game.time_class.toLowerCase() in GameTypes);
    let resgame: Game = {
      wuser: { username: game.white.username, rating: game.white.rating },
      buser: { username: game.black.username, rating: game.black.rating },
      gameType: timeClass ? timeClass : null,
      site: vendor,
      gameResult,
      playerColor: game.white.username == username ? 1 : -1,
      gameId: _gameId,
      drawType: drawType ? drawType : '',
      isReviewed: false,
      date: getYearAndMonth(game.end_time).date,
      movesCount: getMovesNum(game.pgn),
      pgn: game.pgn
    };
    return resgame;
  });
};

/* async function getAllPlayerGames(
  username,
  smonth,
  syear,
  emonth,
  eyear,
  callback1,
  callback2
) {
  let allGames = [];
  let allMoves = [];
  for (let startYear = syear; startYear <= eyear; startYear++) {
    // if current year last month is the current month
    let endMonth = startYear == eyear ? emonth : 12;
    for (let startMonth = smonth; startMonth <= endMonth; startMonth++) {
      let currentMonthGames = await fetchChessGamesonMonth(
        username,
        startYear,
        startMonth
      );
      let minCurrentMonthGames = minimizeData(
        username,
        currentMonthGames["games"]
      );
      allGames = allGames.concat(minCurrentMonthGames);
      allMoves = allMoves.concat(
        minCurrentMonthGames.map((value) => {
          return String(value.pgn)
            .split(/\n\s*\n/)
            .filter((value) => {
              return value[0] == "1";
            })
            .map((value) => {
              return value.split(/\s+/).filter((str) => /^[a-zA-Z]/.test(str));
            });
        })
      );
      callback1();
      callback2(currentMonthGames["games"].length);
    }
    // only the first year might not start from january
    smonth = 1;
  }
  return { allGames, allMoves };
} */

const getYearAndMonth = (
  joinDate: number,
): { year: number; month: number; date: `${string}-${string}` } => {
  // convert to Unix timestamp to milliseconds
  const date = new Date(joinDate * 1000);
  // Get year and month
  const year = date.getFullYear();
  // Months are zero-indexed (0 = January, 1 = February, ..., 11 = December)
  const month = date.getMonth() + 1; // Adding 1 to get 1-based month
  return { year: year, month: month, date: `${month}-${year}` };
};

const getGameById: GetGameById = async (gameId) => {
  return await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/chess.com/game/${gameId}`,
  );
};

export {
  getGameById,
  getUserInfo,
  fetchChessGamesonMonth,
  getYearAndMonth,
  reduceGamesOfMonth,
  getAvalibleArchieves,
  getGamesOfMonth,
};
