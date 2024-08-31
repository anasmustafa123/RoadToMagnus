import { useContext } from 'react';
import ChessBoard from './ChessBoard';
import { ReviewGameContext } from '../contexts/ReviewGameContext';
const Loading_Review_SmallScreen: React.FC = () => {
  const { currentPerc, maxPerc } = useContext(ReviewGameContext);

  return (
    <>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          gridColumn: '1/3'
        }}
      >
        <ChessBoard
          inlineStyles={{
            maxWidth: 'fit-content',
          }}
        />
        <progress
          className="progress-bar"
          max={maxPerc}
          value={currentPerc}
          color="green"
          style={{
            marginTop: '0.7rem',
            width: '90%',
            padding: '1.1rem',
          }}
        />
      </div>
    </>
  );
};

export default Loading_Review_SmallScreen;
