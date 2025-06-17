import React, { useCallback, useEffect, useRef, useState } from 'react';


import LoginLayout    from './components/LoginLayout';
import CheckoutLayout from './components/CheckoutLayout';

import whoami             from './api/whoami';
import login              from './api/login';
import checkout           from './api/checkout';
import type { Book }      from './types/Book.ts';
import type { User }      from './types/User.ts';
import type { Library }   from './types/Library.ts';
import { useTranslation } from 'react-i18next';
import type { Alert }     from './types/Alert.ts';


const LOGIN_ALERT_TIMEOUT_SECONDS = 10;
const CHECKOUT_ALERT_TIMEOUT_SECONDS = 2;
const LOGOUT_TIME_LIMIT = 60;
const DEFAULT_USER_VALUE = {
    name    : '',
    loans   : 0,
    requests: 0,
    fines   : 0,
    id      : ''
};

const App: React.FC = () => {
    const { t } = useTranslation();

    if ( !(new URLSearchParams(window.location.search)).has('library') ) {
        return <div>{ t('libraryNeeded') }</div>;
    }

    const [ loading, setLoading ] = useState<boolean>(true);
    const [ library, setLibrary ] = useState<Library | undefined>(undefined);
    const [ loggedIn, setLoggedIn ] = useState<boolean>(false);
    const [ user, setUser ] = useState<User>(DEFAULT_USER_VALUE);
    const [ loginAlert, setLoginAlert ] = useState<Alert>({
                                                              message  : '',
                                                              isWarning: false,
                                                              color    : 'blue'
                                                          });
    const [ showLoginAlert, setShowLoginAlert ] = useState<boolean>(false);
    const [ logoutTimeLeft, setLogoutTimeLeft ] = useState<number>(LOGOUT_TIME_LIMIT);
    const [ showCheckoutAlert, setShowCheckoutAlert ] = useState<boolean>(false);
    const [ checkoutAlert, setCheckoutAlert ] = useState<Alert>({
                                                                    message  : '',
                                                                    isWarning: false,
                                                                    color    : 'blue'
                                                                });
    const [ booksCheckedOut, setBooksCheckedOut ] = useState<Book[]>([]);

    const currentUserBarcode = useRef<string | undefined>(undefined);

    // Timeouts for alerts
    const loginFailureMessageTimeout = useRef<number | undefined>(undefined);
    const checkoutFailureMessageTimeout = useRef<number | undefined>(undefined);
    const autoLogoutInterval = useRef<number | undefined>(undefined);


    const doLogin = useCallback(async (userBarcode: string) => {
        setShowLoginAlert(true);
        setLoginAlert({
                          message  : t('alert.findingUser'),
                          isWarning: false,
                          color    : 'blue'
                      });

        const newUser = await login(userBarcode);
        if ( 'failureMessage' in newUser ) {
            setLoginAlert({
                              message  : t('login.error'),
                              isWarning: true,
                              color    : 'red'
                          });
            setShowLoginAlert(true);

            window.clearTimeout(loginFailureMessageTimeout.current);
            loginFailureMessageTimeout.current = window.setTimeout(() => {
                setShowLoginAlert(false);
            }, LOGIN_ALERT_TIMEOUT_SECONDS * 1000);
        } else {
            setUser(newUser);
            setShowLoginAlert(false);
            setLogoutTimeLeft(LOGOUT_TIME_LIMIT);
            setLoggedIn(true);


            autoLogoutInterval.current = window.setInterval(() => {
                setLogoutTimeLeft(prevTime => {
                    const newLogoutTimeLeft: number = prevTime - 0.01;

                    if ( newLogoutTimeLeft <= 0 ) {
                        doLogout();
                        return LOGOUT_TIME_LIMIT;
                    }

                    return newLogoutTimeLeft;
                });

            }, 10);

            currentUserBarcode.current = userBarcode;
        }
    }, [ loginFailureMessageTimeout ]);


    const doLogout = useCallback(() => {
        // Clear the states
        setLoggedIn(false);
        setUser(DEFAULT_USER_VALUE);
        setLoginAlert({
                          message  : '',
                          isWarning: false,
                          color    : 'blue'
                      });
        setShowLoginAlert(false);
        setLogoutTimeLeft(LOGOUT_TIME_LIMIT);
        setShowCheckoutAlert(false);
        setCheckoutAlert({
                             message  : '',
                             isWarning: false,
                             color    : 'blue'
                         });
        setBooksCheckedOut([]);

        // Clear the timeouts
        window.clearTimeout(autoLogoutInterval.current);
    }, [ autoLogoutInterval ]);

    const doCheckoutBook = useCallback(async (bookBarcode: string) => {
        // Allow Logout by scanning logged user's barcode
        if ( bookBarcode === currentUserBarcode.current ) {
            doLogout();
        }

        setShowCheckoutAlert(true);
        setCheckoutAlert({
                             message  : t('alert.checkingOut'),
                             isWarning: false,
                             color    : 'blue'
                         });

        const checkedOutBarcodes = booksCheckedOut.map(b => b.barcode);

        if ( checkedOutBarcodes.includes(bookBarcode) ) {
            // Promote Book in List
            const oldBooksCheckedOut = booksCheckedOut.slice();
            const thisBookIndex = oldBooksCheckedOut.findIndex(b => b.barcode === bookBarcode);

            // Remember that .splice return an array so we can concat directly
            const newBooksCheckedOut = oldBooksCheckedOut
                .splice(thisBookIndex, 1)
                .concat(oldBooksCheckedOut);

            // Pretend to have successfully checked out a book
            setLogoutTimeLeft(LOGOUT_TIME_LIMIT);
            setShowCheckoutAlert(false);
            setBooksCheckedOut(newBooksCheckedOut);

            return;
        }

        // Otherwise, try checking the book out
        const newBook = await checkout(bookBarcode, user.id);
        if ( 'failureMessage' in newBook ) {
            // Error checking out book
            setLogoutTimeLeft(LOGOUT_TIME_LIMIT);
            setShowCheckoutAlert(true);
            setCheckoutAlert({
                                 message  : t('checkout.error'),
                                 isWarning: true,
                                 color    : 'red'
                             });

            window.clearTimeout(checkoutFailureMessageTimeout.current);

            checkoutFailureMessageTimeout.current = window.setTimeout(() => {
                setShowCheckoutAlert(false);
            }, CHECKOUT_ALERT_TIMEOUT_SECONDS * 1000);
        } else {
            // Successfully checked out book
            setLogoutTimeLeft(LOGOUT_TIME_LIMIT);
            setShowCheckoutAlert(false);
            setBooksCheckedOut([ newBook ].concat(booksCheckedOut));
        }
    }, [ user, currentUserBarcode, checkoutFailureMessageTimeout ]);

    // Effect to handle the initial loading of the app (similar to old componentDidMount)
    useEffect(() => {
        whoami().then((library) => {
            setLoading(false);

            if ( 'failureMessage' in library ) {
                console.error(library);
                return;
            } else {
                library.featureImage = library.featureImage === 'url/to/image.jpg' ? undefined : library.featureImage;
                library.logo = library.logo === 'url/to/image.jpg' ? undefined : library.logo;
                setLibrary(library);
            }
        });

        return () => {
            window.clearTimeout(loginFailureMessageTimeout.current);
            window.clearTimeout(checkoutFailureMessageTimeout.current);
            window.clearInterval(autoLogoutInterval.current);
        };
    }, []);

    if ( loading ) {
        // return <LoadingLayout />
        return <div>{ t('loading') }</div>;
    } else if ( loggedIn && library ) {
        return <CheckoutLayout library={ library } user={ user } timeout={ logoutTimeLeft } timeLimit={ LOGOUT_TIME_LIMIT } books={ booksCheckedOut } checkoutBook={ doCheckoutBook } logout={ doLogout } showAlert={ showCheckoutAlert } alert={ checkoutAlert } />;
    } else if ( library ) {
        return <LoginLayout library={ library } login={ doLogin } showAlert={ showLoginAlert } alert={ loginAlert } />;
    } else {
        return <div>{ t('libraryNotFound') }</div>;
    }
};

export default App;