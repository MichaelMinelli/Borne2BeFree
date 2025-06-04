import PillBox                          from './PillBox';
import { BookOpenIcon, UserCircleIcon } from './Icons';
import AlertBox                         from './AlertBox.js';
import InputBox                         from './InputBox';
import BookTable                        from './BookTable.js';
import type { Book }                    from '../types/Book.ts';
import type { User }                    from '../types/User.ts';
import type { Library }                 from '../types/Library.ts';
import React                            from 'react';
import { useTranslation }               from 'react-i18next';
import LanguageDopdown                  from './LanguageDopdown.tsx';
import type { Alert }                   from '../types/Alert.ts';


interface CheckoutLayoutProps {
    library: Library;
    user: User;
    timeout: number;
    timeLimit: number;
    checkoutBook: (bookBarcode: string) => Promise<void>;
    books: Array<Book>;
    showAlert: boolean;
    alert: Alert;
}


const CheckoutLayout: React.FC<CheckoutLayoutProps> = ({
                                                           library,
                                                           user,
                                                           timeout,
                                                           timeLimit,
                                                           checkoutBook,
                                                           books,
                                                           showAlert,
                                                           alert
                                                       }) => {

    const { t } = useTranslation();

    return (<div className="h-screen w-screen flex flex-col bg-gray-100">
        {/* <!-- Header Bar --> */ }
        <div className="shrink bg-stone-700 flex content-between items-center p-2 shadow-md" style={ { zIndex: 1 } }>

            {/* <!-- Library Name --> */ }
            <div className="flex-auto text-gray-100 m-2">
                <div className="flex flex-col">
                    <div className="font-light text-2xl">
                        { library.name }
                    </div>
                    <div className="font-extrabold text-sm uppercase">
                        { library.organizationName }
                    </div>
                </div>
            </div>

            {/* <!-- User Details --> */ }
            <div className="flex-auto flex flex-row justify-end items-center">
                <UserCircleIcon classes="w-10 h-10 m-2 text-stone-100" />

                <div className="text-2xl mr-4 text-white">
                    { user.name }
                </div>

                {/* <!-- State Pills --> */ }
                <PillBox title={ t('checkout.pills.loans') } value={ String(user.loans) } />
                <PillBox title={ t('checkout.pills.requests') } value={ String(user.requests) } />
                <PillBox title={ t('checkout.pills.fees') } value={ '$' + user.fines } />

                <div className="ml-8 mr-4 ">
                    <LanguageDopdown light={ false } />
                </div>
            </div>
        </div>

        {/* <!-- Main Content --> */ }
        <div className="flex-auto flex flex-col justify-center items-center">

            {/* <!-- Barcode Scanner --> */ }
            <div className="shrink w-3/4 mt-20">
                <InputBox placeholder={ t('checkout.scanPlaceholder') } Icon={ BookOpenIcon } onClick={ checkoutBook } autoFocus={ true } />
            </div>

            {/* <!-- Alert Dialog --> */ }
            <AlertBox visible={ showAlert } params={ alert }>
                { alert.message }
            </AlertBox>

            {/* <!-- Book Table --> */ }
            <div className="flex-auto w-3/4 px-8 mt-2 z-10">
                <div className="p-5 rounded ">
                    { books.length === 0 ? <div className="text-center text-2xl font-bold text-gray-400 opacity-50">{ t('checkout.logoutInstructions') }</div> : null }
                    <BookTable books={ books } rowLimit={ 5 } />
                </div>
            </div>
        </div>

        {/* <!-- Logout progress bar --> */ }
        <div className={ `fixed w-full bottom-0 ${ library.logo ? ' bg-white' : '' }` }>
            { library.logo && (<div className="w-full bg-white flex flex-row justify-center pt-2">
                <img src={ library.logo } className="h-24 z-0" alt={ `${ library } - ${ library.organizationName } logo` } />
            </div>) }
            <div className="bg-stone-700" style={ { width: (100 - timeout / timeLimit * 100) + '%' } }>
                <div className="text-stone-100 uppercase text-sm font-bold px-4 py-1 whitespace-nowrap">
                    { t('checkout.logoutCountdown', { count: Math.round(timeout) }) }
                </div>
            </div>
        </div>
    </div>);
};

export default CheckoutLayout;
