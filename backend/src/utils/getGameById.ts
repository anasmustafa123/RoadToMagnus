import { Chess } from "chess.js";
import type {GetGameById} from "../@types/common"
const _boards =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?";
const BOARD_FILES = "abcdefgh";
const BOARD_LENGTH = 8;

const PROMOTION_TABLE = "#@$_[]^()~{}";
const PROMOTION_TABLE_ROWS = "brnq";
const PROMOTION_TABLE_ROWS_LENGTH = 4;
const PROMOTION_TABLE_COLUMNS_LENGTH = 3;
const PROMOTION_CAPTURE_LEFT = 1;
const PROMOTION_CAPTURE_RIGHT = 2;

function modifyResult(resultBody: { [key: string]: any }) {
  const game = getproperty(resultBody, "game");
  const moveList = getproperty(game, "moveList", "game.moveList");
  const pgnHeaders = getproperty(
    game,
    "pgnHeaders",
    "game.pgnHeaders"
  );
  game.pgn = _getPGN(pgnHeaders, moveList);
}

function getproperty(
  obj: { [key: string]: any },
  propName: string,
  fullName?: string
) {
  if (Object.prototype.hasOwnProperty.call(obj, propName)) {
    return obj[propName];
  }
  const fieldName = typeof fullName !== "undefined" ? fullName : propName;
  throw new Error(`Missing required field "${fieldName}"`);
}
function _getPGN(
  pgnHeaders: { [key: string]: any },
  moveList: { [key: string]: any }
) {
  const moveListLength = moveList.length;
  if (moveListLength === 0 || moveListLength % 2 !== 0) {
    throw new Error(
      'Malformed field "game.moveList"; ' +
        `expected non-empty, even-number of characters: ${moveList}`
    );
  }
  const chess = "FEN" in pgnHeaders ? new Chess(pgnHeaders.FEN) : new Chess();

  Object.keys(pgnHeaders).forEach((key) => {
    chess.header(key, pgnHeaders[key]);
  });

  for (let i = 0; i < moveListLength; i += 2) {
    const move: any = {
      from: _decodeMove(moveList[i], false),
      to: _decodeMove(moveList[i + 1], true),
    };
    if (move.to instanceof _PawnPromotion) {
      move.promotion = move.to.piece;
      move.to = move.to.getTo(move.from);
    }
    chess.move(move);
  }
  return chess.pgn();
}
function _decodeMove(encMove: any, isTo: any) {
  const index = _boards.indexOf(encMove);
  if (index === -1) {
    // if this is the "to" field, check for pawn promotion
    if (isTo) {
      const promotionIndex = PROMOTION_TABLE.indexOf(encMove);
      if (promotionIndex !== -1) {
        // @ts-ignore
        return new _PawnPromotion(promotionIndex);
      }
    }
    throw new Error(`Unrecognized move-character: ${encMove}`);
  }
  const file = BOARD_FILES[index % BOARD_LENGTH];
  const rank = Math.floor(index / BOARD_LENGTH) + 1;
  return `${file}${rank}`;
}

function _PawnPromotion(
  this: { piece: string; isCaptureLeft: boolean; isCaptureRight: boolean },
  index: number
) {
  const pieceIndex = Math.floor(index / PROMOTION_TABLE_COLUMNS_LENGTH);
  if (pieceIndex > PROMOTION_TABLE_ROWS_LENGTH - 1) {
    // this can only happen if the const table values are wrong
    throw new Error(`Pawn promotion row index out of bounds: ${pieceIndex}`);
  }

  this.piece = PROMOTION_TABLE_ROWS[pieceIndex];
  this.isCaptureLeft =
    index % PROMOTION_TABLE_COLUMNS_LENGTH === PROMOTION_CAPTURE_LEFT;
  this.isCaptureRight =
    index % PROMOTION_TABLE_COLUMNS_LENGTH === PROMOTION_CAPTURE_RIGHT;
}
_PawnPromotion.prototype.getTo = function (from: any) {
  const fromFile = from[0];
  const fromRank = from[1];
  const fromFileIndex = BOARD_FILES.indexOf(fromFile);

  let toFileIndex;
  if (this.isCaptureLeft) {
    toFileIndex = fromFileIndex - 1;
  } else {
    toFileIndex = this.isCaptureRight ? fromFileIndex + 1 : fromFileIndex;
  }

  // sanity check: ensure pawn is still on the board after promotion
  if (toFileIndex < 0 || toFileIndex > BOARD_LENGTH - 1) {
    throw new Error(
      `Invalid pawn promotion; file index out of bounds: ${toFileIndex}`
    );
  }
  const toFile = BOARD_FILES[toFileIndex];

  // sanity check: ensure pawn rank is 2 or 7 prior to promotion
  let toRank;
  if (fromRank === "2") {
    toRank = "1";
  } else if (fromRank === "7") {
    toRank = "8";
  } else {
    throw new Error(`Invalid rank prior to pawn promotion: ${fromRank}`);
  }
  return `${toFile}${toRank}`;
};

const getGameById:GetGameById = (gameId) => {
  return fetch(`https://www.chess.com/callback/live/game/${gameId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((resultBody) => {
      modifyResult(resultBody);
      return resultBody;
    });
};
export { getGameById };
