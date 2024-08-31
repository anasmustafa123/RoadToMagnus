import { toast } from 'react-toastify';
import { parsePgn } from '../scripts/pgn';
import { Game } from '../types/Game';
import { Vendor } from '../types/Api';
async function fetchLichesssGames(username: string) {
  const url = `https://lichess.org/api/games/user/${username}`;
  const response = await fetch(url);
  if (!response.ok) {
    toast.error('Error Enter correct lichess username.');
  }
  toast.success('correct username wait for game loading....');
  const data = await response.text();
  console.log(data);
  return data;
}

const getUserInfo = async (username: string) => {
  const url = `https://lichess.org/api/user/${username}`;
  try {
    const res = await fetch(url);
    console.error(res);
    return { ok: true, data: await res.json() };
  } catch (e) {
    return { ok: false, data: null };
  }
};

async function fetchOpeningData(fen: string) {
  const url = `https://explorer.lichess.ovh/masters?fen=${fen}`;
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.error('Error fetching opening data:', error);
  }
}

const checkIfBook = async (
  fen: string,
): Promise<{ ok: boolean; opening?: string }> => {
  return new Promise((resolve) => {
    fetchOpeningData(fen).then((data) => {
      if (data.opening) {
        resolve({ ok: true, opening: data.opening });
      } else {
        resolve({ ok: false });
      }
    });
  });
};

/**
 *
 * @param username lichess player username
 * @param updateGames callback function to update the games called after each game is fetched
 */
const fetchPlayerGames = async ({
  username,
  updateGames,
  sinceDate,
  toDate,
}: {
  username: string;
  updateGames: (games: Game[]) => void;
  sinceDate?: string;
  toDate?: string;
}): Promise<{ ok: boolean; games: Game[]; message?: string }> => {
  return new Promise(async (resolve) => {
    const url =
      sinceDate && toDate
        ? `https://lichess.org/api/games/user/${username}?since=${sinceDate}&until=${toDate}`
        : toDate
          ? `https://lichess.org/api/games/user/${username}&until=${toDate}`
          : sinceDate
            ? `https://lichess.org/api/games/user/${username}?since=${sinceDate}`
            : `https://lichess.org/api/games/user/${username}?rated=true&perfType=blitz,rapid,bullet&evals=false`;
    const response = await fetch(url);
    if (!response.ok) {
      resolve({
        message: `HTTP error! status: ${response.status}`,
        ok: false,
        games: [],
      });
      return;
    }
    const readablestream = response.body;
    if (readablestream === null) {
      resolve({ message: 'No games found', ok: false, games: [] });
      return;
    }
    const reader = readablestream.getReader();
    let result: Game[] = [];
    reader.read().then(function handlechunks({ done, value }) {
      if (done) {
        console.log('fetched all games');
        resolve({ games: result, ok: true });
        return;
      }
      try {
        let currentgamepgn = new TextDecoder().decode(value);
        const parsedPgn = parsePgn(currentgamepgn);
        const game: Game = {
          ...parsedPgn,
          site: 'lichess' as Vendor,
          playerColor: parsedPgn.wuser.username == username ? 1 : -1,
        };
        result.push(game);
        updateGames(result);
        reader.read().then(handlechunks);
      } catch (e) {
        resolve({ message: `${e}`, ok: false, games: result });
        return;
      }
    });
  });
};

/**
 *@returns {sdate:{month: number, year: number}, edate:{month: number, year: number}}
 */
const getLichessDates = (
  username: string,
): Promise<{
  sdate: { month: number; year: number };
  edate: { month: number; year: number };
}> => {
  return new Promise((resolve, reject) => {
    fetch(`https://lichess.org/api/user/${username}`)
      .then((response) => response.json())
      .then((data) => {
        const sdate = {
          month: new Date(data.createdAt).getMonth() + 1,
          year: new Date(data.createdAt).getFullYear(),
        };
        const edate = {
          month: new Date(data.seenAt).getMonth() + 1,
          year: new Date(data.seenAt).getFullYear(),
        };
        resolve({ sdate, edate });
      })
      .catch((err) => {
        reject(`catched error:  ${err}`);
      });
  });
};

export {
  fetchLichesssGames,
  getUserInfo,
  checkIfBook,
  fetchPlayerGames,
  getLichessDates,
};
