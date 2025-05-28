import React, { useEffect, useRef, useState } from 'react';
import { useTranslation }                     from 'react-i18next';
import SupportedLanguages                     from '../i18n/SupportedLanguages.ts';


interface LanguageDropdownProps {
    light?: boolean;
}


const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ light = false }) => {
    const { i18n } = useTranslation();
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const currentLanguage = i18n.language;
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fonction de changement de langue, ferme le dropdown après sélection
    const handleChangeLanguage = (lang: string): void => {
        i18n.changeLanguage(lang).then();
        setIsOpen(false);
    };

    // Fermeture du dropdown en cliquant à l'extérieur du composant
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if ( dropdownRef.current && !dropdownRef.current.contains(event.target as Node) ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (<div ref={ dropdownRef } className="relative inline-block text-left">
        <button type="button" onClick={ () => setIsOpen(!isOpen) } className="inline-flex font-semibold justify-center w-full rounded-full border-2 border-stone-200 shadow-sm px-5 py-2 bg-stone-700 text-xl  hover:bg-stone-400 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <span className="mr-2">
          { SupportedLanguages[currentLanguage as keyof typeof SupportedLanguages]?.flag }
        </span>
            { !light && (<span>
            { SupportedLanguages[currentLanguage as keyof typeof SupportedLanguages]?.nativeName }
          </span>) }
            <svg className="-mr-1 ml-2 h-7 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M19 9l-7 7-7-7" />
            </svg>
        </button>

        { isOpen && (<div className="origin-top-right font-semibold absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
                { Object.keys(SupportedLanguages).map((lang) => (<button key={ lang } onClick={ () => handleChangeLanguage(lang) } className="flex items-center w-full px-4 py-2 text-xl text-gray-700 hover:bg-gray-100">
                <span className="mr-2">
                  { SupportedLanguages[lang as keyof typeof SupportedLanguages].flag }
                </span>
                    { !light && (<span>
                    { SupportedLanguages[lang as keyof typeof SupportedLanguages].nativeName }
                  </span>) }
                </button>)) }
            </div>
        </div>) }
    </div>);
};

export default LanguageDropdown;
