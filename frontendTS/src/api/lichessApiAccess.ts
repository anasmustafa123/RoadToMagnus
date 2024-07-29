import { toast } from 'react-toastify';
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
  const res = await fetch(url);
  console.log(res);
  return { ok: res.ok, data: await res.json() };
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
    fetchOpeningData(fen)
      .then((data) => {
        if (data.opening) {
          resolve({ ok: true, opening: data.opening });
        } else {
          resolve({ ok: false });
        }
      });
  });
};

export { fetchLichesssGames, getUserInfo, checkIfBook };
