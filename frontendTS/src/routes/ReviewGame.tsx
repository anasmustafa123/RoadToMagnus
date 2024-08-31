import Loading_Review_LargeScreen from '../components/Labtop_loading';
import Loading_Review_SmallScreen from '../components/Phone_loading';
import ReviewResult from '../components/ReviewResult';
import ChessBoard_Eval from '../components/ChessBoard_Eval';
import { memo, useContext, useState } from 'react';
import { ReviewGameContext } from '../contexts/ReviewGameContext';
import styles from '../styles/ReviewGame.module.css';
import { ChessBoardContextProvider } from '../contexts/GameBoardContext';
import { UserContext } from '../contexts/UserContext';
const ReviewGame = () => {
  const { largeScreen, setLargeScreenWidth } = useContext(UserContext);
  const { reviewStatus } = useContext(ReviewGameContext);
  const [expand_review_state, setExpand_review_state] = useState(false);
  const [showEval_chessmoves, setShowChessmoves] = useState(false);
  return reviewStatus ? (
    showEval_chessmoves ? (
      <ChessBoardContextProvider>
        <ChessBoard_Eval
          inlineStyles={{
            gridColumn: '2 / 3',
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        />
      </ChessBoardContextProvider>
    ) : (
      <>
        <ReviewResult expand_review_state={expand_review_state} />
        <div className={styles.showReview}>
          <div
            onClick={() => {
              const current_review_state = !expand_review_state;
              setExpand_review_state(current_review_state);
            }}
            className={styles.expand_review}
          >
            <i
              style={
                expand_review_state
                  ? { boxShadow: '0px 0px 0px red' }
                  : {
                      boxShadow: '1px -31px 28px 30px rgba(255, 255, 255, 0.9)',
                    }
              }
              className={
                expand_review_state
                  ? 'bx bx-chevrons-up'
                  : 'bx bx-chevrons-down'
              }
            ></i>
          </div>
          <button>Review</button>
        </div>
      </>
    )
  ) : largeScreen ? (
    <Loading_Review_LargeScreen />
  ) : (
    <Loading_Review_SmallScreen />
  );
};

export default ReviewGame;
