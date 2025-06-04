import { ExclamationSolidIcon, InformationSolidIcon } from './Icons';

import './AlertBox.css';
import React                                          from 'react';
import type { Alert }                                 from '../types/Alert.ts';


interface AlertBoxProps {
    children: React.ReactNode;
    visible: boolean;
    params: Alert;
}


const AlertBox: React.FC<AlertBoxProps> = ({
                                               children,
                                               visible,
                                               params
                                           }) => {
    return <div className={ `flex flex-row items-center m-4 bg-${ params.color }-50 rounded-lg border-2 border-${ params.color }-800 p-2 ${ visible ? '--show-alert' : '--hide-alert' }` }>
        { params.isWarning && <ExclamationSolidIcon classes={ `w-6 h-6 text-${ params.color }-800` } /> }
        { !params.isWarning && <InformationSolidIcon classes={ `w-6 h-6 text-${ params.color }-800` } /> }
        <div className={ `mx-2 text-${ params.color }-900` }>
            { children }
        </div>
    </div>;
};

export default AlertBox;