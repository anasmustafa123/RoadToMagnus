export type ClassName =
  | 'book'
  | 'great'
  | 'best'
  | 'excellent'
  | 'good'
  | 'forced'
  | 'inaccuracy'
  | 'mistake'
  | 'blunder'
  | 'missed'
  | 'botezgambit'
  | 'brilliant'
  | 'unknown';

export type ClassSymbol =
  | '!$'
  | '$$'
  | '$'
  | '=$$'
  | '!!'
  | '!'
  | '=='
  | '?!'
  | '?'
  | '??'
  | '?$'
  | '????';

export type ClassificationScores = {
  [key in ClassName]: [number, number];
};
export interface Classification {
  color: string;
  sym: ClassSymbol;
  name: ClassName;
}

export const classificationInfo: Classification[] = [
  { name: 'book', color: '#503912', sym: '!$' },
  { name: 'brilliant', color: '#00989dba', sym: '$$' },
  { name: 'great', color: '#185fb5d9', sym: '$' },
  { name: 'best', color: '#509d00', sym: '=$$' },
  { name: 'excellent', color: '#5caa0b', sym: '!!' },
  { name: 'good', color: '#768c51', sym: '!' },
  { name: 'forced', color: '#7c9f89', sym: '==' },
  { name: 'inaccuracy', color: '#ff9800', sym: '?!' },
  { name: 'mistake', color: '#e3786a', sym: '?' },
  { name: 'blunder', color: '#ff0909', sym: '??' },
  { name: 'missed', color: '#da3f2a', sym: '?$' },
  { name: 'botezgambit', color: '#5c5c5c', sym: '????' },
  { name: 'unknown', color: '#5c5c5c', sym: '????' },
];
export const classnames = [
  'book',
  'brilliant',
  'great',
  'best',
  'excellent',
  'good',
  'forced',
  'inaccuracy',
  'mistake',
  'blunder',
  'missed',
  'botezgambit',
];
export const emptyClassificationScores: ClassificationScores = {
  book: [0, 0],
  brilliant: [0, 0],
  great: [0, 0],
  best: [0, 0],
  excellent: [0, 0],
  good: [0, 0],
  inaccuracy: [0, 0],
  mistake: [0, 0],
  missed: [0, 0],
  forced: [0, 0],
  blunder: [0, 0],
  botezgambit: [0, 0],
  unknown: [0, 0],
};
