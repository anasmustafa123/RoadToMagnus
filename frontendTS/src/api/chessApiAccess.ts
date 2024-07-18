import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMovesNum } from '../scripts/pgn';
import { ChessComGame, Vendor } from '../types/Api';
import type {
  Game,
  GameResult,
  GamesCount,
  GameType,
  GameTypes,
} from '../types/Game';
async function getUserInfo(username: string) {
  const url = `https://api.chess.com/pub/player/${username}`;
  const res = await fetch(url);
  console.log(res);
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
      toast.error('Error Enter correct chess.com username..');
      throw new Error(`Error fetching games: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error('Error Enter correct chess.com username...');
    return null; // Or handle the error differently
  }
}

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
  return monthGames.map((game) => {
    let gameResult: GameResult =
      game.black.result.toLowerCase() === 'win'
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
    const gameTypee: GameType = game.time_class.toLowerCase();
    gamesCount[gameTypee as GameTypes]++;
    console.log(gamesCount);
    let resgame: Game = {
      wuser: { username: game.white.username, rating: game.white.rating },
      buser: { username: game.black.username, rating: game.black.rating },
      gameType: game.time_class.toLowerCase(),
      site: vendor,
      gameResult,
      playerColor: game.white.username == username ? 1 : -1,
      gameId: 1,
      drawType: drawType ? drawType : '',
      isReviewed: false,
      date: getYearAndMonth(game.end_time).date,
      movesCount: getMovesNum(game.pgn),
      gamesCount,
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

/* const getPgnsOfMonth = async (username, year, month) => {
  const apiUrl = `https://api.chess.com/pub/player/${username}/games/${year}/${month}/pgn`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      toast.error('Error Enter correct chess.com username..');
      throw new Error(`Error fetching games: ${response.status}`);
    }
    let pgnData = await response.text();
    return pgnData;
  } catch (error) {
    console.error('Error fetching PGN data:', error);
  }
}; */

export {
  getUserInfo,
  fetchChessGamesonMonth,
  getYearAndMonth,
  reduceGamesOfMonth,
};
