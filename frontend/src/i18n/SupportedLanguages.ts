import type { Language } from './Language.ts';
import fr                from './fr.json' assert { type: 'json' };
import de                from './de.json' assert { type: 'json' };
import it                from './it.json' assert { type: 'json' };
import en                from './en.json' assert { type: 'json' };


const languages: { [iso639: string]: Language } = {
    fr: {
        iso639    : 'fr',
        nativeName: 'Français',
        flag      : '🇫🇷',
        resource  : {
            translation: fr
        }
    },
    de: {
        iso639    : 'de',
        nativeName: 'Deutsch',
        flag      : '🇩🇪',
        resource  : {
            translation: de
        }
    },
    it: {
        iso639    : 'it',
        nativeName: 'Italiano',
        flag      : '🇮🇹',
        resource  : {
            translation: it
        }
    },
    en: {
        iso639    : 'en',
        nativeName: 'English',
        flag      : '🇬🇧',
        resource  : {
            translation: en
        }
    }
};

export default languages;