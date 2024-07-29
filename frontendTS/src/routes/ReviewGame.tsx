import NewReview from '../components/NewReview';
import ReviewResult from '../components/ReviewResult';
import ChessBoard_Eval from '../components/ChessBoard_Eval';
import { useContext } from 'react';
import { ReviewGameContext } from '../contexts/ReviewGameContext';
const ReviewGame = () => {
  const { reviewStatus } = useContext(ReviewGameContext);
  console.log(reviewStatus);

  return !reviewStatus ? <NewReview /> : <ReviewResult />;
};

export default ReviewGame;
