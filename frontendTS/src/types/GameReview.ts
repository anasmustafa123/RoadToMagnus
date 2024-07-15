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


export interface ClassificationRes {
  color: string;
  sym: ClassSymbol;
  name: ClassName;
}
