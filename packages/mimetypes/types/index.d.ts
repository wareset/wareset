import { TypeEXTNAMES } from './lib/mimes';
declare const EXTENSIONS: TypeEXTNAMES;
export { EXTENSIONS };
export declare const ext: (file: string) => keyof TypeEXTNAMES | '';
export declare const extname: (filepath: string) => string;
export declare const mime: (filepath: string) => string;
export declare const mimeList: (filepath: string) => string[];
