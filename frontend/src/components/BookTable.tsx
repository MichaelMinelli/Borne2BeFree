import type { Book }      from '../types/Book.ts';
import React              from 'react';
import { useTranslation } from 'react-i18next';


interface BookTableProps {
    books: Array<Book>,
    rowLimit: number
}


const BookTable: React.FC<BookTableProps> = ({
                                                 books,
                                                 rowLimit
                                             }) => {
    const { t } = useTranslation();

    if ( books.length === 0 ) {
        return null;
    }

    const bookList = books.length > rowLimit + 1 ? books.slice(0, rowLimit) : books;
    return <table className="table-auto w-full">
        <thead className="uppercase text-xs font-bold text-stone-700">
            <tr>
                <td className="px-2">{ t('bookTable.columns.dueDate') }</td>
                <td className="px-2">{ t('bookTable.columns.book') }</td>
            </tr>
        </thead>
        <tbody className="text-xl">
            { bookList.map(b => <tr key={ b.barcode } className="border-b border-gray-400">
                <td className="p-2 font-bold text-xs">{ b.dueDate }</td>
                <td className="p-2 truncate" style={ { maxWidth: '50vw' } }>{ b.bookString }</td>
            </tr>) }
            { books.length > rowLimit + 1 ? <tr>
                <td></td>
                <td className="p-2 italic">{ t('bookTable.rows.others', { count: books.length - rowLimit }) }</td>
            </tr> : null }
        </tbody>
    </table>;
};

export default BookTable;
