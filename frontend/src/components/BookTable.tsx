import type { Book } from '../types/Book.ts';
import React         from 'react';


interface BookTableProps {
    books: Array<Book>,
    rowLimit: number
}


const BookTable: React.FC<BookTableProps> = ({
                                                 books,
                                                 rowLimit
                                             }) => {
    if ( books.length === 0 ) {
        return null;
    }

    const bookList = books.length > rowLimit + 1 ? books.slice(0, rowLimit) : books;
    return <table className="table-auto w-full">
        <thead className="uppercase text-xs font-bold text-blue-800">
            <tr>
                <td className="px-2">Due Date</td>
                <td className="px-2">Book</td>
            </tr>
        </thead>
        <tbody className="text-xl">
            { bookList.map(b => <tr key={ b.barcode } className="border-b border-gray-400">
                <td className="p-2 text-gray-500 text-xs">{ b.dueDate }</td>
                <td className="p-2 truncate" style={ { maxWidth: '50vw' } }>{ b.bookString }</td>
            </tr>) }
            { books.length > rowLimit + 1 ? <tr>
                <td></td>
                <td className="p-2 italic">{ `and ${ books.length - rowLimit } others...` }</td>
            </tr> : null }
        </tbody>
    </table>;
};

export default BookTable;
