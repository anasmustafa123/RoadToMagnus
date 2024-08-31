import Dexie, { Table } from 'dexie';
import { Vendor } from '../types/Api';

interface IDB_User {
  username: string;
  lichessdate: number | null;
  chessdate: number | null;
  key: string;
}
interface IDB_Game {
  username: string;
  pgn: string;
  key: string;
  vendor: Vendor;
}

const db = new Dexie('RoadToMagnus') as Dexie & {
  games: Table<IDB_Game, string>;
  users: Table<IDB_User, string>;
};

// Schema declaration:
db.version(1).stores({
  games: '&key',
  users: '&key',
});

export type { IDB_Game, IDB_User };
export { db };
