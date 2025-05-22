interface IconProps {
    value: string;
    title?: string;
}


const PillBox: React.FC<IconProps> = ({
                                          title,
                                          value
                                      }) => {
    return <div className={ 'flex items-center rounded-full border-2 border-blue-300 m-2 py-1 pr-1 text-blue-200 ' + (title ? 'pl-3' : 'pl-1') }>
        { title && <div className="font-extrabold text-xs uppercase text-blue-100 mr-2">{ title }</div> }
        <div className="rounded-full w-8 h-8 bg-blue-300 flex justify-center items-center text-white">
            { value }
        </div>
    </div>;
};

export default PillBox;