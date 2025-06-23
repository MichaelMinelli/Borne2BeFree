import React, { useEffect, useRef, useState } from 'react';
import { useTranslation }                     from 'react-i18next';
import type { LibraryResume }                 from '../types/Library.ts';


interface LibrariesDropdownProps {
    libraries: Array<LibraryResume>;
    currentLibrary?: LibraryResume;
    setCurrentLibrary: (newValue: LibraryResume) => void;
}


const LibrariesDropdown: React.FC<LibrariesDropdownProps> = ({
                                                                 libraries,
                                                                 currentLibrary,
                                                                 setCurrentLibrary
                                                             }) => {
    const { t } = useTranslation();
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fonction de changement de langue, ferme le dropdown après sélection
    const handleChangeLibrary = (library: LibraryResume): void => {
        setCurrentLibrary(library);
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

    let currentLibraryName = t('libraryLogin.libraryPlaceholder');
    if ( currentLibrary ) {
        currentLibraryName = libraries[libraries.findIndex((library) => library.apiName === currentLibrary.apiName)].name;
    }

    return (<div ref={ dropdownRef } className="relative text-left flex w-full mb-5">
        <button type="button" onClick={ () => setIsOpen(!isOpen) } className="cursor-pointer inline-flex font-semibold justify-center w-full rounded-lg border-4 border-stone-700 shadow-sm px-5 py-2 bg-gray-50 text-xl  hover:bg-gray-200 focus:outline-none">
            <span>
                { currentLibraryName }
            </span>
            <svg className="-mr-1 ml-2 h-7 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M19 9l-7 7-7-7" />
            </svg>
        </button>

        { isOpen && (<div className="origin-top-right font-semibold absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
                { libraries.map((library) => (<button key={ library.apiName } onClick={ () => handleChangeLibrary(library) } className="cursor-pointer flex items-center w-full px-4 py-2 text-xl text-gray-700 hover:bg-gray-100">
                        <span className="mr-2">
                            { library.name }
                        </span>
                </button>)) }
            </div>
        </div>) }
    </div>);
};

export default LibrariesDropdown;
