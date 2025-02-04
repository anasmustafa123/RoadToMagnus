import { EngineLine } from '../types/Game';
import { getFenArr } from './convert';

class GameReviewManager {
  private current_index: number;
  private un_evaluated_sanmoves: string[];
  private engine_responses: { engineLines: EngineLine[]; move_num: number }[];
  private fen_arr: string[];

  get_next_move() {
    const current_fen = this.fen_arr[this.current_index];
    const sanmove = this.un_evaluated_sanmoves[this.current_index];
    const move_num = this.current_index;
    this.current_index++;
    return { sanmove, move_num, current_fen };
  }

  done_evaluating() {
    return this.current_index >= this.un_evaluated_sanmoves.length;
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
    this.current_index = 0;
    this.un_evaluated_sanmoves = un_evaluated_sanmoves;
    this.engine_responses = [];
    this.fen_arr = getFenArr(un_evaluated_sanmoves);
  }
}

export default GameReviewManager;
