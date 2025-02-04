import { getMovesNum } from '../scripts/pgn';
import { ChessComGame, Vendor } from '../types/Api';
import type { Game, GameResult, GamesCount, GameType } from '../types/Game';
import { GameTypes } from '../types/Game';
import { GetGameById } from '../types/common';
async function getUserInfo(username: string) {
  const url = `https://api.chess.com/pub/player/${username}`;
  const res = await fetch(url);
  return { ok: res.ok, data: await res.json() };
}

const getmissingarchieves = ({
  newyear,
  newmonth,
  cyear,
  cmonth,
}: {
  newyear: number;
  newmonth: number;
  cyear: number;
  cmonth: number;
}) => {
  let res = [];
  const currentYear = cyear;
  while (newyear >= cyear) {
    let smonth = currentYear == cyear ? cmonth : 1;
    let emonth = cyear == newyear ? newmonth : 12;
    for (let i = smonth; i <= emonth; i++) {
      res.push({ month: i, year: cyear });
    }
    cyear++;
  }
  return res;
};

/**
 *
 * @param username
 * @returns the last month and year of the last game played by user in chess.com
 */
const get_chessDcom_last_date = (
  username: string,
): Promise<
  | { ok: true; month: number; year: number }
  | { ok: false; month: null; year: null }
> => {
  return new Promise((resolve, reject) => {
    getAvalibleArchieves(username)
      .then((archieves) => {
        let [lastyear, lastmonth] = archieves.archives[
          archieves.archives.length - 1
        ]
          .split('/')
          .slice(-2);
        let month = parseInt(lastmonth);
        let year = parseInt(lastyear);
        resolve({ ok: true, month: month, year: year });
        return;
      })
      .catch((err) => {
        resolve({ ok: false, month: null, year: null });
        return;
      });
  });
};

const getAvalibleArchieves = async (username: string) => {
  const url = `https://api.chess.com/pub/player/${username}/games/archives`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching games: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('enter correct chess.com username');
    return null; // Or handle the error differently
  }
};

const getAllGames = async (
  username: string,
  afterEachMonthCallback: (games: Game[]) => void,
) => {
  try {
    const res = await getAvalibleArchieves(username);
    if (!res.archives) {
      return { ok: false, message: 'no archieves', games: [] };
    }
    let full_games = [] as Game[];
    for (let url of res.archives as string[]) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          continue;
        }
        const data = await response.json();
        let month_games = reduceGamesOfMonth('chess.com', username, data.games);
        afterEachMonthCallback(month_games);
        full_games = full_games.concat(month_games);
      } catch (error) {
        console.error('enter correct chess.com username');
        continue;
      }
    }
    return { ok: true, message: '', games: full_games };
  } catch (e) {
    return { ok: false, games: [], message: `Error fetching games: ${e}` };
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
  return new Promise<Game[]>(async (resolve) => {
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
    let _gameId = '';
    if (game.url) {
      let res = game.url.split('/');
      if (res.length > 0) {
        let url = res[res.length - 1];
        _gameId = url;
      }
    }
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
    const timeClass = GameTypes.find((v) => game.time_class.toLowerCase() == v)
      ? (game.time_class.toLowerCase() as GameType)
      : undefined;
    timeClass ? (gamesCount[timeClass] = gamesCount[timeClass] + 1) : '';
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
      pgn: game.pgn,
    };
    return resgame;
  });
};

async function fetch_games_onperiod({
  username,
  smonth,
  syear,
  emonth,
  eyear,
  afterEachMonthCallback,
}: {
  username: string;
  smonth: number | null;
  syear: number | null;
  emonth: number | null;
  eyear: number | null;
  afterEachMonthCallback: (games: Game[]) => any;
}): Promise<{ ok: boolean; allGames: Game[] }> {
  let allGames: Game[] = [];
  if (eyear == null || emonth == null || smonth == null || syear == null) {
    let res = await getAllGames(username, afterEachMonthCallback);
    if (res.ok) {
      return { ok: true, allGames: res.games };
    } else {
      return { ok: false, allGames: [] };
    }
  } else {
    for (let startYear = syear; startYear <= eyear; startYear++) {
      // if current year last month is the current month
      let endMonth = startYear == eyear ? emonth : 12;
      const size = endMonth - smonth + 1;
      for (let startMonth of Array(size)
        .fill(0)
        .map((v, i) => (smonth as number) + i)) {
        let games = await getGamesOfMonth(username, startYear, startMonth);
        afterEachMonthCallback(games);
        allGames = allGames.concat(games);
      }
      // only the first year might not start from january
      smonth = 1;
    }
    return { ok: true, allGames };
  }
}

const getYearAndMonth = (
  joinDate: number,
): { year: number; month: number; date: `${string}-${string}` } => {
  // convert to Unix timestamp to milliseconds
  const date = new Date(joinDate * 1000);
  // Get year and month
  const year = date.getFullYear();
  // Months are zero-indexed (0 = January, 1 = February, ..., 11 = December)
  const month = date.getMonth() + 1; // Adding 1 to get 1-based month
  return { year: year, month: month, date: `${year}-${month}` };
};

const getGameById: GetGameById = async (gameId) => {
  return await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/chess.com/game/${gameId}`,
  );
};

export {
  getGameById,
  getUserInfo,
  getAvalibleArchieves,
  fetch_games_onperiod,
  get_chessDcom_last_date,
  getmissingarchieves,
};
