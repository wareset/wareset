import { TypeEXTNAMES } from './lib/mimes';
import { MIME_TYPES } from './lib/mimes';
declare const EXTENSIONS: TypeEXTNAMES;
declare const MIMES: {
    [K in typeof MIME_TYPES[number]]: {
        [key: string]: true;
    };
};
export { EXTENSIONS, MIMES as MIME_TYPES };
export declare const ext: (file: string) => keyof TypeEXTNAMES | '';
export declare const extname: (filepath: string) => string;
export declare const mime: (filepath: string) => string;
export declare const mimeList: (filepath: string) => string[];
