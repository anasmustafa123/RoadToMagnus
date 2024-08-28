interface Response<T = any> {
  ok: boolean;
  data: T;
}

export class Indexed {
  private database_name: string;
  private database_version: number = 1;
  private db: IDBDatabase | undefined;
  /**
   * @param db_name if not avaliable, it will use the default database name
   * @returns Promise<IDBDatabase>
   */
  startDb(
    db_name: string = this.database_name,
  ): Promise<Response<IDBDatabase>> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(db_name, this.database_version);
      request.onsuccess = (e: any) => {
        this.database_version = e.target.result.version;
        this.db = e.target.result;
        if (this.db) {
          this.db.onerror = (e: any) => {
            reject(`error opening database: ${e}`);
            return;
          };
        } else reject(`error opening database (not found): ${e}`);
        resolve({ ok: true, data: e.target.result });
        request.onerror = null;
        request.onsuccess = null;
        request.onupgradeneeded = null;
        return;
      };
      request.onerror = (e: any) => {
        reject(`error opening database: ${e}`);
        return;
      };
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        this.database_version++;
      };
    });
  }
  // add_store
  add_store(store_name: string, structure?: any[]): Promise<Response<string>> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject({ message: 'Database not found', key: 404 });
        return;
      }
      if (this.db.objectStoreNames.contains(store_name)) {
        resolve({ ok: false, data: 'store already exists' });
        return;
      } else {
        this.startDb().then(async (res) => {
          const store = res.data.createObjectStore(store_name);
          store.createIndex('id', 'id', { unique: true });
          resolve({ ok: true, data: 'store created' });
          return;
        });
      }
    });
  }
  // delete_store

  // update_store

  // add_one
  add_one(store_name: string, data: { [key: string]: any }) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject({ message: 'Database not found', key: 404 });
        return;
      }
      if (!this.db.objectStoreNames.contains(store_name)) {
        resolve({ ok: false, data: 'store not found' });
        return;
      } else {
        const store = this.db
          .transaction(store_name, 'readwrite')
          .objectStore(store_name);
        store.add({ ...data });
      }
    });
  }
  // remove_one
  remove_one(store_name: string, key: string) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject({ message: 'Database not found', key: 404 });
        return;
      }
      if (!this.db.objectStoreNames.contains(store_name)) {
        reject({ message: 'store not found', key: 403 });
        return;
      } else {
        const transaction = this.db.transaction(store_name, 'readwrite');
        const store = transaction.objectStore(store_name);
        store.delete(key);
        transaction.oncomplete = (e: any) => {
          resolve({ ok: true, data: 'deleted' });
        };
        transaction.onerror = (e: any) => {
          reject({ message: 'error deleting', key: 500 });
        };
      }
    });
  }
  // get_one
  get_one(store_name: string, key: string) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject({ message: 'Database not found', key: 404 });
        return;
      }
      if (!this.db.objectStoreNames.contains(store_name)) {
        resolve({ ok: false, data: 'store not found' });
        return;
      } else {
        const store = this.db
          .transaction(store_name, 'readwrite')
          .objectStore(store_name);
        const request = store.get(key);
        request.onsuccess = (e: any) => {
          resolve({ ok: true, data: e.srcElement.result });
        };
        request.onerror = (e) => {
          reject({ request: e });
        };
      }
    });
  }
  // get_all

  // updateItem

  // get_version_number

  // get_store_names
  get_store_names() {
    if (!this.db) {
      return [];
    } else {
      return this.db.objectStoreNames;
    }
  }

  constructor(db_name: string) {
    this.database_name = db_name;
  }
}
