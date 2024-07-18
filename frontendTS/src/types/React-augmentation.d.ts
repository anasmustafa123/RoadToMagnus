import 'react';

declare module 'react' {
  interface CSSProperties {
    '--hover-color'?: string;
    '--block-border'?: string;
  }
}
