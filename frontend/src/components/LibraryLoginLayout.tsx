import InputBox               from './InputBox.js';
import AlertBox               from './AlertBox.js';
import { PasswordIcon }       from './Icons.js';
import type { LibraryResume } from '../types/Library.ts';
import React                  from 'react';
import { useTranslation }     from 'react-i18next';
import type { Alert }         from '../types/Alert.ts';
import LibrariesDopdown       from './LibrariesDropdown.tsx';


interface LibraryLoginLayoutProps {
    libraries: Array<LibraryResume>;
    currentLibrary?: LibraryResume;
    setCurrentLibrary: (newValue: LibraryResume) => void;
    login: (password: string) => Promise<void>;
    alert: Alert;
    showAlert: boolean;
}


const LibraryLoginLayout: React.FC<LibraryLoginLayoutProps> = ({
                                                                   libraries,
                                                                   currentLibrary,
                                                                   setCurrentLibrary,
                                                                   login,
                                                                   alert,
                                                                   showAlert
                                                               }) => {

    const { t } = useTranslation();

    return <div className="h-screen w-screen flex flex-row">
        <div className="flex-auto bg-gray-200 flex flex-col justify-center items-center">
            <div className="grow flex flex-col justify-end mb-8 text-center">
                <div className="font-light text-3xl">
                    { t('libraryLogin.title') }
                </div>
            </div>

            <div className="shrink flex-row">
                <LibrariesDopdown libraries={ libraries } currentLibrary={ currentLibrary } setCurrentLibrary={ setCurrentLibrary } />
                <InputBox placeholder={ t('libraryLogin.passwordPlaceholder') } hideEntry={ true } Icon={ PasswordIcon } onClick={ login } autoFocus={ true } />
            </div>
            { showAlert && <div className="shrink">
                <AlertBox visible={ showAlert } params={ alert }>
                    { alert.message }
                </AlertBox>
            </div> }
            <div className="shrink flex-row mt-4">

            </div>
            <div className="grow flex flex-col justify-end w-full">

            </div>
        </div>
    </div>;
};

export default LibraryLoginLayout;
