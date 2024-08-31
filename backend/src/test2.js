
const fetchPlayerGames = async (username, updateGames, month_str, year) => {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(
      `https://api.chess.com/pub/player/${username}/games/${year}/${month_str}/pgn`
    );
    if (!response.ok) {
      reject(`HTTP error! status: ${response.status}`);
      return;
    }
    const readablestream = response.body;
    console.log(response);
    if (readablestream === null) {
      reject("No games found");
      return;
    }
    const reader = readablestream.getReader();
    let result = [];
    reader.read().then(function handlechunks({ done, value }) {
      if (done) {
        resolve(result);
        return;
      }
      try {
        let currentgamepgn = new TextDecoder().decode(value);
        result.push(currentgamepgn);
        updateGames(result);
        reader.read().then(handlechunks);
      } catch (e) {
        reject(e);
      }
    });
  });

  /*  .then((result) => {
      console.log('final result');
      return result;
    })
    .catch((e) => {
      return `HTTP error! status: ${e.status}`;
    }); */
};
/* console.time("fetchplayergames");
const games = await fetchPlayerGames(
  "anasmostafa11",
  (games) => {
    console.log(games.length);
  },
  "05",
  2022
).catch((e) => {
  console.log(e);
});
console.log(games[3]); */

/* fetch("https://lichess.org/api/games/user/gg").then((response) => {
  const readablestream = response.body;
  console.log(readablestream);
  const reader = readablestream.getReader();
  console.log(reader);
  try {
    reader.releaseLock();
    const reader2 = readablestream.getReader();
    console.log(reader2);
  } catch (e) {
    console.error(e.message);
  }
}); */

async function sendDataAsStream(data) {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(data));
      controller.close();
    }
  });

  const response = await fetch('/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream'
    },
    body: stream
  });

  if (response.ok) {
    console.log('Data sent successfully.');
  } else {
    console.error('Error sending data:', response.statusText);
  }
}

const largeData = '...'; // Your large data here
sendDataAsStream(largeData);
