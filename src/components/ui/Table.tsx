import React from 'react';

interface TableHeader {
  key: string;
  label: string;
  className?: string;
}

interface TableProps<T> {
  headers: TableHeader[];
  data: T[];
  renderCell: (row: T, headerKey: string) => React.ReactNode;
}

const Table = <T,>({ headers, data, renderCell }: TableProps<T>) => {
  return (
    <div className="w-full overflow-hidden rounded-lg shadow-md border border-gray-200">
      <div className="w-full overflow-x-auto">
        <table className="w-full whitespace-no-wrap">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
              {headers.map((header) => (
                <th key={header.key} className={`px-4 py-3 ${header.className || ''}`}>{header.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {data.map((row, rowIndex) => (
              <tr key={(row as any).parametroId || rowIndex} className="text-gray-700 hover:bg-gray-100 transition-colors duration-150">
                {headers.map((header) => (
                  <td key={`${(row as any).parametroId || rowIndex}-${header.key}`} className="px-4 py-3 text-sm">
                    {renderCell(row, header.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
