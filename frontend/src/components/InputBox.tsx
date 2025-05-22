import React, { useCallback, useEffect, useRef } from 'react';
import { ArrowCircleLeftIcon }                   from './Icons.js';


interface InputBoxProps {
    Icon: React.FC<{ classes: string }>;
    placeholder: string;
    autoFocus?: boolean;
    onClick: (value: string) => Promise<void>;
}


const InputBox: React.FC<InputBoxProps> = ({
                                               Icon,
                                               placeholder,
                                               autoFocus,
                                               onClick
                                           }) => {
    const textInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if ( autoFocus && textInput.current ) {
            textInput.current.focus();
        }
    }, [ autoFocus ]);

    const clickCallback = useCallback(async () => {
        const value = textInput.current?.value;
        if ( textInput.current && value ) {
            await onClick(value);
            textInput.current.value = '';
            textInput.current.focus();
        }
    }, [ onClick ]);

    return <div className="flex bg-gray-50 rounded-lg border-blue-400 border-4">
        <div className="flex-none flex items-center m-5">
            <Icon classes={ 'w-8 h-8' } />
        </div>
        <input ref={ textInput } className="text-2xl bg-transparent outline-none grow" placeholder={ ' ' + placeholder } onKeyUp={ key => {
            if ( key.key === 'Enter' ) {
                clickCallback().then();
            }
        } } />
        <button onClick={ clickCallback } href="#" className="flex-none flex items-center m-2 p-2 rounded cursor-pointer bg-blue-400 text-gray-200 hover:bg-blue-500 hover:text-white hover:shadow-md active:bg-blue-600">
            <ArrowCircleLeftIcon classes="w-10 h-10" />
        </button>
    </div>;
};

export default InputBox;