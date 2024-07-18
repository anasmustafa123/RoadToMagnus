import { toast } from "react-toastify";
async function fetchLichesssGames(username:string) {
  const url = `https://lichess.org/api/games/user/${username}`;
  const response = await fetch(url);
  if (!response.ok) {
    toast.error("Error Enter correct lichess username.");
  }
  toast.success("correct username wait for game loading....");
  const data = await response.text();
  console.log(data);
  return data;
}

const getUserInfo = async (username:string) => {
  const url = `https://lichess.org/api/user/${username}`;
  const res = await fetch(url);
  console.log(res);
  return { ok: res.ok, data: await res.json() };
};

export { fetchLichesssGames, getUserInfo };
