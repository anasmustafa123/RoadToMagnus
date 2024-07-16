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

  type Unknown = 'unknown';
type x = Partial<ClassName>
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
