import type GameReviewManager from './_GameReviewManager';
import { getCloudEvaluation } from '../api/lichessApiAccess';

class CloudEvalWorker {
  private game_review_manager: GameReviewManager;
  constructor(game_review_manager: GameReviewManager) {
    this.game_review_manager = game_review_manager;
  }
  async evaluatePosition(ui_update_callback: () => void) {
    console.log('evaluating position');
    let continue_flag = true;
    while (!this.game_review_manager.done_evaluating() && continue_flag) {
      const currentMove = this.game_review_manager.get_next_move();
      const { current_fen, move_num } = currentMove;
      const cloud_eval = await getCloudEvaluation(current_fen);
      if (!cloud_eval) continue_flag = false;
      console.warn({ currentMove });
      console.warn({ cloud_eval });
      //console.debug({ engineLines });
      ui_update_callback();
      this.game_review_manager.add_enginelines(cloud_eval, move_num);
    }
    console.log('terminate_worker');
    return { success: true };
  }
}
export default CloudEvalWorker;
