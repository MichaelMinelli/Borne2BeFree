import type { ResourceLanguage } from 'i18next';


interface Language {
    iso639: string;
    nativeName: string;
    flag: string;
    resource: ResourceLanguage;
}


export type { Language };