import { EngineLine } from '../types/Game';
import { getFenArr } from './convert';

class GameReviewManager {
  private indexes: number[];
  private un_evaluated_sanmoves: string[];
  private engine_responses: { engineLines: EngineLine[]; move_num: number }[];
  private fen_arr: string[];

  get_next_move() {
    const current_index = this.indexes.pop();
    const current_fen = this.fen_arr[current_index];
    const sanmove = this.un_evaluated_sanmoves[current_index];
    const move_num = current_index;
    return { sanmove, move_num, current_fen };
  }

  return_move(move_num:number) {
    this.indexes.push(move_num);
  }

  done_evaluating() {
    return !this.indexes.length;
  }

  add_enginelines(engineLines: EngineLine[], move_num: number) {
    this.engine_responses.push({ engineLines, move_num });
  }

  get_engineResponses(): EngineLine[][] {
    return this.engine_responses.map((engine_response) => {
      return engine_response.engineLines;
    });
  }

  constructor(un_evaluated_sanmoves: string[]) {
    this.indexes = new Array(un_evaluated_sanmoves.length)
      .fill(0)
      .map((_, i) => un_evaluated_sanmoves.length - i - 1);
    console.log({ indexes: this.indexes });
    this.un_evaluated_sanmoves = un_evaluated_sanmoves;
    this.engine_responses = [];
    this.fen_arr = getFenArr(un_evaluated_sanmoves);
  }
}

export default GameReviewManager;
