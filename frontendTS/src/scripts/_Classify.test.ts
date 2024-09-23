import { ChessInstance, PieceColor, Square } from 'chess.js';
import {
  AttackPiece,
  Move,
  EngineLine,
  Evaluation,
  PlayerColor,
} from '../types/Game';
import { Piece } from 'react-chessboard/dist/chessboard/types';
import { findAllInRenderedTree } from 'react-dom/test-utils';

const minwining = (rating: number, plColor: PlayerColor) => {
  const wineval =
    rating <= 600
      ? 300.0
      : rating > 600 && rating <= 1000
        ? 250.0
        : rating > 1000 && rating <= 1400
          ? 200.0
          : rating > 1400 && rating <= 1800
            ? 150.0
            : 100.0;
  return wineval * plColor;
};

const minLosing = (rating: number, plColor: PlayerColor) => {
  return -1 * minwining(rating, plColor);
};

const isWining = (
  bestEvaluation: Evaluation,
  plRating: number,
  plColor: PlayerColor,
) => {
  if (bestEvaluation.type === 'cp') {
    return (
      bestEvaluation.value * plColor >= minwining(plRating, plColor) * plColor
    );
  } else {
    return bestEvaluation.value * plColor > 0;
  }
};

const isLosing = (
  bestEvaluation: Evaluation,
  plRating: number,
  plColor: PlayerColor,
) => {
  if (bestEvaluation.type === 'cp') {
    return (
      bestEvaluation.value * plColor <= minLosing(plRating, plColor) * plColor
    );
  } else {
    return bestEvaluation.value * plColor < 0;
  }
};

/**
 * @param {EngineLine[]} prevEngineResponse
 * @param {boolean} iswining
 * @param {boolean} islosing
 * @param {boolean} waswining
 * @param {boolean} waslosing
 * @param {boolean} plRating
 * @param {boolean} plColor
 * @returns
 */
const isGreat = (
  prevEngineResponse: EngineLine[],
  iswining: boolean,
  islosing: boolean,
  waswining: boolean,
  waslosing: boolean,
  plRating: number,
  plColor: PlayerColor,
) => {
  if (prevEngineResponse.length > 1) {
    let wasLosing2Line = isLosing(
      prevEngineResponse[0].evaluation,
      plRating,
      plColor,
    );
    let wasWining2Line = isWining(
      prevEngineResponse[0].evaluation,
      plRating,
      plColor,
    );
    let isDrawing = !iswining && !islosing;
    let wasDrawing = !waswining && !waslosing;

    if (
      (waswining && iswining && !wasWining2Line) ||
      (wasDrawing && isDrawing && wasLosing2Line)
    ) {
      return true;
    }
  }
  return false;
};

describe('isGreat', () => {
  const mockEngineLines: EngineLine[] = [
    {
      evaluation: { type: 'cp', value: 50 },
      bestMove: 'a1a1',
      id: 2,
      depth: 18,
    },
    {
      evaluation: { type: 'cp', value: 120 },
      bestMove: 'a1a2',
      id: 1,
      depth: 18,
    },
  ];

  test('', () => {
    expect(isGreat(mockEngineLines, true, false, true, false, 1500, 1)).toBe(
      true,
    );
    expect(isGreat(mockEngineLines, false, true, true, false, 1500, 1)).toBe(
      false,
    );
    expect(isGreat(mockEngineLines, true, false, true, true, 1500, 1)).toBe(
      true,
    );
    expect(isGreat(mockEngineLines, true, true, true, true, 1500, 1)).toBe(
      true,
    );
    expect(isGreat(mockEngineLines, true, false, false, true, 1500, 1)).toBe(
      false,
    );
    expect(isGreat(mockEngineLines, true, true, false, true, 1500, -1)).toBe(
      false,
    );
  });
});

describe('Classify', () => {
  test('minWining', () => {
    expect(minwining(1200, -1)).toEqual(-200);
    expect(minwining(1400, -1)).toEqual(-200);
    expect(minwining(800, -1)).toEqual(-250);
    expect(minwining(500, -1)).toEqual(-300);
    expect(minwining(2000, -1)).toEqual(-100);
  });
  test('minLosing', () => {
    expect(minLosing(1200, 1)).toEqual(-200);
    expect(minLosing(1400, 1)).toEqual(-200);
    expect(minLosing(800, 1)).toEqual(-250);
    expect(minLosing(500, 1)).toEqual(-300);
    expect(minLosing(2000, 1)).toEqual(-100);
    expect(minLosing(1200, -1)).toEqual(200);
    expect(minLosing(1400, -1)).toEqual(200);
    expect(minLosing(800, -1)).toEqual(250);
    expect(minLosing(500, -1)).toEqual(300);
    expect(minLosing(2000, -1)).toEqual(100);
  });
  test('isWining', () => {
    // test for type "cp" && plColor = 1
    expect(isWining({ type: 'cp', value: 301 }, 800, 1)).toEqual(true);
    expect(isWining({ type: 'cp', value: -299 }, 800, 1)).toEqual(false);
    expect(isWining({ type: 'cp', value: 250 }, 1000, 1)).toEqual(true);
    expect(isWining({ type: 'cp', value: 150 }, 1200, 1)).toEqual(false);
    expect(isWining({ type: 'cp', value: 210 }, 1300, 1)).toEqual(true);
    expect(isWining({ type: 'cp', value: -210 }, 1400, 1)).toEqual(false);
    expect(isWining({ type: 'cp', value: 200 }, 1500, 1)).toEqual(true);
    expect(isWining({ type: 'cp', value: -150 }, 1600, 1)).toEqual(false);
    expect(isWining({ type: 'cp', value: 150 }, 1700, 1)).toEqual(true);
    expect(isWining({ type: 'cp', value: -150 }, 1800, 1)).toEqual(false);
    expect(isWining({ type: 'cp', value: 150 }, 1900, 1)).toEqual(true);
    expect(isWining({ type: 'cp', value: -150 }, 2000, 1)).toEqual(false);
    // test for type "mate" && plColor = 1
    expect(isWining({ type: 'mate', value: 5 }, 1200, 1)).toEqual(true);
    expect(isWining({ type: 'mate', value: -3 }, 1200, 1)).toEqual(false);
    expect(isWining({ type: 'mate', value: 1 }, 1800, 1)).toEqual(true);
    expect(isWining({ type: 'mate', value: -1 }, 1800, 1)).toEqual(false);
    // test for type "mate" && plColor = -1
    expect(isWining({ type: 'mate', value: 5 }, 1200, -1)).toEqual(false);
    expect(isWining({ type: 'mate', value: -3 }, 1200, -1)).toEqual(true);
    expect(isWining({ type: 'mate', value: 1 }, 1800, -1)).toEqual(false);
    expect(isWining({ type: 'mate', value: -1 }, 1800, -1)).toEqual(true);
    // test for type "cp" && plColor = -1
    expect(isWining({ type: 'cp', value: 301 }, 800, -1)).toEqual(false);
    expect(isWining({ type: 'cp', value: -299 }, 800, -1)).toEqual(true);
    expect(isWining({ type: 'cp', value: 250 }, 1000, -1)).toEqual(false);
    expect(isWining({ type: 'cp', value: -201 }, 1200, -1)).toEqual(true);
    expect(isWining({ type: 'cp', value: -150 }, 1400, -1)).toEqual(false);
  });
  /*   test('getMoveClassification returns "book" for first move', async () => {
    const engineResponse: EngineLine[] = [
      get_engineLine(20),
    ];
    const result = await classify.getMoveClassification({
      engineResponse,
      plColor: 1,
      moveNum: 1,
      gameInfo: mockGame,
      initial_Evaluation: { type: 'cp', value: 0 },
    });
    expect(result).toBe('book');
  }); */

  /*   test('getMoveClassification classifies normal moves', async () => {
    const engineResponse: EngineLine[] = [
      { evaluation: { type: 'cp', value: 50 } } as EngineLine,
    ];
    classify.evaluations = [{ type: 'cp', value: 20 }];
    classify.engineResponses = [[{ evaluation: { type: 'cp', value: 20 } }]];

    const result = await classify.getMoveClassification({
      engineResponse,
      plColor: 1,
      moveNum: 2,
      gameInfo: mockGame,
      initial_Evaluation: { type: 'cp', value: 0 },
    });

    expect(['excellent', 'good', 'inaccuracy', 'mistake', 'blunder']).toContain(
      result,
    );
  }); */

  /*   test('getMoveClassification identifies best moves', async () => {
    const engineResponse: EngineLine[] = [
      { evaluation: { type: 'cp', value: 50 }, bestMove: 'e2e4' } as EngineLine,
    ];
    classify.evaluations = [{ type: 'cp', value: 20 }];
    classify.engineResponses = [
      [{ evaluation: { type: 'cp', value: 50 }, bestMove: 'e2e4' }],
    ];

    const result = await classify.getMoveClassification({
      engineResponse,
      plColor: 1,
      moveNum: 2,
      gameInfo: mockGame,
      initial_Evaluation: { type: 'cp', value: 0 },
    });

    expect(result).toBe('best');
  }); */

  // Add more tests for other classification scenarios...

  /*  test('_init method resets the game state', () => {
    const newGame = new Chess(
      'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
    );
    classify._init({ game: newGame });
    expect(classify.game.fen()).toBe(
      'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
    );
  }); */
});

describe('isLosing', () => {
  it('should return true for losing centipawn evaluation', () => {
    const evaluation: Evaluation = { type: 'cp', value: -300 };
    expect(isLosing(evaluation, 1500, 1)).toBe(true);
    expect(isLosing(evaluation, 1500, -1)).toBe(false);
  });

  it('should return false for winning centipawn evaluation', () => {
    const evaluation: Evaluation = { type: 'cp', value: 300 };
    expect(isLosing(evaluation, 1500, 1)).toBe(false);
    expect(isLosing(evaluation, 1500, -1)).toBe(true);
  });

  it('should return true for losing mate evaluation', () => {
    const evaluation: Evaluation = { type: 'mate', value: -3 };
    expect(isLosing(evaluation, 1500, 1)).toBe(true);
    expect(isLosing(evaluation, 1500, -1)).toBe(false);
  });

  it('should return false for winning mate evaluation', () => {
    const evaluation: Evaluation = { type: 'mate', value: 3 };
    expect(isLosing(evaluation, 1500, 1)).toBe(false);
    expect(isLosing(evaluation, 1500, -1)).toBe(true);
  });

  it('should consider player rating for centipawn evaluation', () => {
    const evaluation: Evaluation = { type: 'cp', value: -200 };
    expect(isLosing(evaluation, 1000, 1)).toBe(false);
    expect(isLosing(evaluation, 2000, 1)).toBe(true);
  });
});
