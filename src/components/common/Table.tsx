import React from 'react';

interface Column<T> {
    header: string;
    accessor: keyof T | ((data: T) => React.ReactNode);
    className?: string; // Optional custom className for the column cells
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    isLoading?: boolean;
}

const Table = <T extends { _id: string }>({ data, columns, isLoading }: TableProps<T>) => {
    if (isLoading) {
        return <div className="p-4 text-center text-gray-500">Loading...</div>;
    }

    if (data.length === 0) {
        return <div className="p-4 text-center text-gray-500">No data found.</div>;
    }

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full leading-normal">
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className={`px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${col.className || ''}`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                            {columns.map((col, index) => (
                                <td key={index} className="px-5 py-5 border-b border-gray-200 text-sm">
                                    {typeof col.accessor === 'function'
                                        ? col.accessor(item)
                                        : (item[col.accessor] as React.ReactNode)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
