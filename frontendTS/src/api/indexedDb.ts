import { Vendor } from '../types/Api';

const dbName = import.meta.env.VITE_TITLE as string;

let db: IDBDatabase | null = null;

const init_indexedDb = ({
  storeName,
  dbVersion,
}: {
  storeName: string;
  dbVersion: number;
}): Promise<{ ok: boolean; database: IDBDatabase }> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (storeName != '' && !db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    };

    request.onsuccess = () => {
      db = request.result;
      resolve({ ok: true, database: db });
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

const isUser = (): Promise<{ ok: boolean; data: any }> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject('Database is not open');
      return;
    }
    const transaction = db.transaction('users', 'readwrite');
    const store = transaction.objectStore('users');
    const request = store.getAll();

    request.onsuccess = (e: any) => {
      resolve({ ok: true, data: e.srcElement.result[0] });
    };

    request.onerror = (e) => {
      reject(`catched ${e}`);
    };
  });
};

const logout = async () => {
  return new Promise(async (resolve, reject) => {
    const user = (await isUser()) as any;
    if (user != undefined && user.data && user.data.id) {
      if (!db) init_indexedDb({ storeName: '', dbVersion: 2 });
      const deleteReq = db
        ?.transaction(['users'], 'readwrite')
        .objectStore('users')
        .delete(user.data.id);
      if (deleteReq) {
        deleteReq.onsuccess = () => {
          resolve({ ok: true });
        };
        deleteReq.onerror = () => {
          reject({ ok: false });
        };
      }
    } else resolve({ ok: true });
  });
};

const addData = (param: {
  storename: string;
  data: {
    pgn?: string;
    key: string;
    lichessdate?: number;
    chessdate?: number;
    vendor: Vendor;
    username: string;
  };
}): Promise<{ ok: boolean }> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject('Database is not open');
      return;
    }
    const transaction = db.transaction(param.storename, 'readwrite');
    const store = transaction.objectStore(param.storename);
    let request: IDBRequest<IDBValidKey>;
    request = param.data.pgn
      ? store.add(
          {
            pgn: param.data.pgn,
            id: param.data.key,
            username: param.data.username,
          },
          param.data.key,
        )
      : store.add(
          {
            chessdate: param.data.chessdate,
            lichessdate: param.data.lichessdate,
            id: param.data.key,
            username: param.data.username,
          },
          param.data.key,
        );
    // @ts-ignore
    if (request) {
      request.onsuccess = () => {
        resolve({ ok: true });
      };

      request.onerror = () => {
        reject(request.error);
      };
    }
  });
};

const getDataByKey = (param: {
  storename: string;
  data: { key: string };
}): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject('Database is not open');
      return;
    }
    try {
      const transaction = db.transaction(param.storename, 'readwrite');
      const store = transaction.objectStore(param.storename);
      const request = store.get(param.data.key);
      request.onsuccess = (e: any) => {
        resolve(e.srcElement.result );
      };

      request.onerror = (e) => {
        reject({ request: e });
      };
    } catch (e) {
      reject(`no store with the name: ${param.storename}- ${e}`);
    }
  });
};

const updateData = (param: {
  storename: string;
  data: { pgn?: string; key: string; lichessdate?: string; chessdate?: string };
}): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject('Database is not open');
      return;
    }

    const transaction = db.transaction(param.storename, 'readwrite');
    const store = transaction.objectStore(param.storename);
    const request = param.data.pgn
      ? store.put({ pgn: param.data.pgn, id: param.data.key }, param.data.key)
      : store.put(
          {
            chessdate: param.data.chessdate,
            lichessdate: param.data.lichessdate,
            id: param.data.key,
          },
          param.data.key,
        );

    request.onsuccess = (e: any) => {
      resolve({ ok: true, data: e.srcElement.result });
    };

    request.onerror = (e: any) => {
      reject({ ok: false, request });
    };
  });
};

const deleteData = (param: {
  storename: string;
  data: { key: string } | { key: Vendor };
}): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject('Database is not open');
      return;
    }

    const transaction = db.transaction(param.storename, 'readwrite');
    const store = transaction.objectStore(param.storename);
    const request = store.delete(param.data.key);

    request.onsuccess = () => {
      resolve({ ok: true, request });
    };

    request.onerror = () => {
      reject({ ok: false, request });
    };
  });
};

const getAllGames = (): Promise<{
  ok: boolean;
  value: { gameId: string; pgn: { pgn: string } }[];
}> => {
  let storeName = 'Games';
  return new Promise((resolve, reject) => {
    if (!db) {
      reject('Database is not open');
      return;
    }
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    let games: any[] = [];
    store.openCursor().onsuccess = (event) => {
      try {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          games.push({ pgn: cursor.value, gameId: String(cursor.key) });
          cursor.continue();
        } else {
          resolve({ ok: true, value: games });
        }
      } catch (e) {
        reject(e);
      }
    };
  });
};

export {
  init_indexedDb,
  addData,
  getDataByKey,
  getAllGames,
  updateData,
  deleteData,
  isUser,
  logout,
};
