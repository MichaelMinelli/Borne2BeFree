import InputBox               from './InputBox.js';
import AlertBox               from './AlertBox.js';
import { IdentificationIcon } from './Icons.js';
import type { Library }       from '../types/Library.ts';
import React                  from 'react';


interface LoginLayoutProps {
    library: Library;
    login: (userBarcode: string) => Promise<void>;
    alertMessage: string;
    showAlert: boolean;
}


const LoginLayout: React.FC<LoginLayoutProps> = ({
                                                     library,
                                                     login,
                                                     alertMessage,
                                                     showAlert
                                                 }) => {
    return <div className="h-screen w-screen flex flex-row">
        { library.featureImage && <div className="lg:flex-auto bg-blue-100 text-gray-200" style={ {
            background    : `url(${ library.featureImage }) center center`,
            backgroundSize: 'cover'
        } } /> }
        <div className="flex-auto bg-gray-200 flex flex-col justify-center items-center">
            <div className="grow flex flex-col justify-end mb-8 text-center">
                <div className="font-light text-3xl">
                    Self-Checkout for { library.name }
                </div>
                <div className="font-bold text-lg uppercase">
                    { library.organizationName }
                </div>
            </div>

            <div className="shrink flex-row">
                <InputBox placeholder={ 'Scan your ID' } Icon={ IdentificationIcon } onClick={ login } autoFocus={ true } />
            </div>
            <div className="shrink">
                <AlertBox visible={ showAlert }>
                    { alertMessage }
                </AlertBox>
            </div>
            <div className="grow flex flex-col justify-end w-full">
                { library.logo && (<div className="w-full bg-white flex flex-row justify-center">
                    <img src={ library.logo } className="max-h-32" alt={ `${ library } at ${ library.organizationName } logo` } />
                </div>) }
            </div>
        </div>
    </div>;
};

export default LoginLayout;
