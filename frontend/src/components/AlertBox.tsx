import { ExclamationSolidIcon } from './Icons';

import './AlertBox.css';
import React                    from 'react';


interface AlertBoxProps {
    children: React.ReactNode;
    visible: boolean;
}


const AlertBox: React.FC<AlertBoxProps> = ({
                                               children,
                                               visible
                                           }) => {
    return <div className={ `flex flex-row items-center m-4 bg-red-300 rounded-lg border-2 border-red-800 p-2 ${ visible ? '--show-alert' : '--hide-alert' }` }>
        <ExclamationSolidIcon classes="w-6 h-6 text-red-800" />
        <div className="mx-2 text-red-900">
            { children }
        </div>
    </div>;
};

export default AlertBox;