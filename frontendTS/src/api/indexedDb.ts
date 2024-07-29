import { Vendor } from '../types/Api';

const dbName = import.meta.env.VITE_TITLE as string;
const dbVersion = 1;
const storeName = 'Games';

let db: IDBDatabase | null = null;

const init_indexedDb = (): Promise<{ ok: boolean; database: IDBDatabase }> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      console.log('upgradeneeded');
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
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

const addData = (param: {
  storename: string;
  data: { pgn?: string; key: number; month?: number; year?: number };
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
      ? store.add({ pgn: param.data.pgn }, param.data.key)
      : store.add({ month: param.data.month, year: param.data.year });
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
  data: { key: number };
}): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject('Database is not open');
      return;
    }

    const transaction = db.transaction(param.storename, 'readonly');
    const store = transaction.objectStore(param.storename);
    const request = store.get(param.data.key);

    request.onsuccess = () => {
      resolve({ ok: true, request });
    };

    request.onerror = () => {
      reject({ ok: false, request });
    };
  });
};

const updateData = (param: {
  storename: string;
  data: { pgn?: string; month?: string; year?: string; key: number };
}): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject('Database is not open');
      return;
    }

    const transaction = db.transaction(param.storename, 'readwrite');
    const store = transaction.objectStore(param.storename);
    const request = param.data.pgn
      ? store.put({ pgn: param.data.pgn }, param.data.key)
      : store.put(
          { month: param.data.month, year: param.data.year },
          param.data.key,
        );

    request.onsuccess = () => {
      resolve({ ok: true, request });
    };

    request.onerror = () => {
      reject({ ok: false, request });
    };
  });
};

const deleteData = (param: {
  storename: string;
  data: { key: number } | { key: Vendor };
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
  value: { gameId: number; pgn: string }[];
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
          console.log(cursor);
          games.push({ pgn: cursor.value, gameId: cursor.key });
          cursor.continue();
        } else {
          console.log('finished');
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
};
