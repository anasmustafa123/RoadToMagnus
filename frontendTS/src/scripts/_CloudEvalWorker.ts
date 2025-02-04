import type GameReviewManager from './_GameReviewManager';
import { getCloudEvaluation } from '../api/lichessApiAccess';

class CloudEvalWorker {
  private game_review_manager: GameReviewManager;
  constructor(game_review_manager: GameReviewManager) {
    this.game_review_manager = game_review_manager;
  }

  async evaluatePosition(after_each_move_callback: () => void) {
    console.log('evaluating position');
    let continue_flag = true;
    while (!this.game_review_manager.done_evaluating() && continue_flag) {
      after_each_move_callback();
      const { current_fen, move_num } =
        this.game_review_manager.get_next_move();
      const cloud_eval = await getCloudEvaluation(current_fen);
      console.log({ cloud_eval });
      if (cloud_eval.ok) {
        this.game_review_manager.add_enginelines(
          cloud_eval.engineLines,
          move_num,
        );
      } else {
        this.game_review_manager.return_move(move_num);
        continue_flag = false;
      }
    }
    console.log('terminate cloud worker');
    debugger;
    return { success: true };
  }
}
export default CloudEvalWorker;
