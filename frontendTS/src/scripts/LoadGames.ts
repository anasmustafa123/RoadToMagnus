import { getAvalibleArchieves } from '../api/chessApiAccess';
import {
  init_indexedDb,
  isUser,
  getDataByKey,
  updateData,
  addData,
} from '../api/indexedDb';
import { fetchPlayerGames, getUserInfo } from '../api/lichessApiAccess';
import { Vendor, Vendors } from '../types/Api';
import { Game } from '../types/Game';

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
      //res.push(`${url}/${cyear}/${i > 9 ? i : '0' + i}`);
    }
    cyear++;
  }
  return res;
};

const getMissingData = ({
  storekey,
  vendor,
  username,
  afterGameCallback,
  afterGamesCallback,
}: {
  storekey: string;
  vendor: Vendor;
  username: string;
  afterGameCallback: (games: Game[]) => void;
  afterGamesCallback: (games: Game[]) => void;
}): Promise<{ ok: boolean; data: any }> => {
  return new Promise((resolve, reject) => {
    console.debug(storekey);
    isUser()
      .then((isuser) => {
        if (isuser.ok) {
          init_indexedDb({ storeName: '', dbVersion: 2 }).then((res) => {
            if (res.ok) {
              getDataByKey({
                storename: 'users',
                data: { key: storekey },
              }).then((IDBres) => {
                console.debug('user indexedDb info fetched');
                // check the indexedDb for sdata and edate : res.data
                console.dir(IDBres);
                const lichessdate = IDBres.lichessDate;
                const chessdate = IDBres.chessDate;
                // get missing archieves on chess.com
                if (vendor == 'chess.com') {
                  getAvalibleArchieves(username).then((archieves) => {
                    let [lastyear, lastmonth] = archieves.archives[
                      archieves.archives.length - 1
                    ]
                      .split('/')
                      .slice(-2);
                    let [startyear, startmonth] = archieves.archives[0]
                      .split('/')
                      .slice(-2);
                    console.debug(lastmonth, lastyear);
                    let newmonth = parseInt(lastmonth);
                    let newyear = parseInt(lastyear);
                    let newstartyear = parseInt(startyear);
                    let newstartmonth = parseInt(startmonth);
                    if (chessdate) {
                      const arr = chessdate.split('-');
                      if (arr.length === 2) {
                        const currentmonth = parseInt(arr[0]);
                        const currentyear = parseInt(arr[1]);
                        let missingarchieves = getmissingarchieves({
                          cmonth: currentmonth,
                          cyear: currentyear,
                          newmonth,
                          newyear,
                        });
                        console.dir(missingarchieves);
                        resolve({
                          ok: true,
                          data: {
                            'chess.com_missingArchieves': missingarchieves,
                            lichess_missingArchieves: [],
                          },
                        });
                      } else {
                        console.warn(
                          'date data in indexedDb is not in correct format smonth-syear',
                        );
                        reject(
                          'date data in indexedDb is not in correct format smonth-syear',
                        );
                      }
                    } else {
                      let missingarchieves = getmissingarchieves({
                        cmonth: newstartmonth,
                        cyear: newstartyear,
                        newmonth,
                        newyear,
                      });
                      resolve({
                        ok: true,
                        data: {
                          'chess.com_missingArchieves': missingarchieves,
                          lichess_missingArchieves: [],
                        },
                      });
                    }
                  });
                } else if (vendor == 'lichess') {
                  getUserInfo(username).then((res) => {
                    let lastdate = {
                      year: new Date(res.data.seenAt).getFullYear(),
                      month: new Date(res.data.seenAt).getMonth() + 1,
                    };
                    if (lichessdate) {
                      const arr = lichessdate.split('-');
                      if (arr.length === 2) {
                        const currentmonth = parseInt(arr[0]);
                        const currentyear = parseInt(arr[1]);
                        fetchPlayerGames('gg', afterGameCallback)
                        .then((fullgames: any) => {
                          afterGamesCallback(fullgames);
                        })
                        .catch((e) => {
                          console.error(`error catched: ${e}`);
                        });
                      }
                    } else {
                      fetchPlayerGames('gg', afterGameCallback)
                        .then((fullgames: any) => {
                          afterGamesCallback(fullgames);
                        })
                        .catch((e) => {
                          console.error(`error catched: ${e}`);
                        });
                    }
                  });
                }
              });
            }
          });
        } else {
          reject({ message: 'user not logged in' });
        }
      })
      .catch((e) => {
        reject({ message: 'user not logged in' });
      });
  });
};
export { getMissingData };

// check cmonth and userStartdate on both lichess and chess.com
// compare and get the missing data
