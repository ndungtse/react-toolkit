import { getObjValue } from '@/utils/funcs';
import { Button, Checkbox, Input, Table, TableProps } from '@mantine/core';
import React, { useEffect } from 'react';
import { GoPlus } from 'react-icons/go';
import PaginationComponent from './pagination';
import { CellContext, Column, IPagination, RowContext, TableContext } from './types';

export interface DataTableProps {
   data: any[];
   columns: Column[];
   tableHeader?: (tableContext: TableContext) => React.ReactNode;
   pagination?: IPagination;
   paginationPosition?: 'top' | 'bottom' | 'both';
   paginate?: boolean; // default: true
   title?: string | React.ReactNode;
   buttonText?: string | React.ReactNode;
   showHeader?: boolean;
   minWidth?: React.CSSProperties['minWidth'];
   tableProps?: TableProps;
   onPress?: () => void;
}

const DataTable = (props: DataTableProps) => {
   const {
      data,
      columns,
      tableHeader,
      pagination,
      paginate = true,
      title,
      showHeader = true,
      minWidth,
      tableProps,
      buttonText,
      onPress,
   } = props;
   const [_data, setData] = React.useState(data);
   const [globalFilter, setGlobalFilter] = React.useState('');
   const [selectedRows, setSelectedRows] = React.useState<RowContext[]>([]);


   const toggleRow = (row: RowContext) => {
      // console.log('---row---', row);
      const selectedRow = selectedRows.find((r) => JSON.stringify(r.data) === JSON.stringify(row.data));
      if (selectedRow) {
         setSelectedRows(selectedRows.filter((r) => JSON.stringify(r.data) !== JSON.stringify(row.data)));
      } else {
         setSelectedRows([...selectedRows, row]);
      }
   };

   const toggleAllRows = () => {
      if (selectedRows.length === data.length) {
         setSelectedRows([]);
      } else {
         setSelectedRows(data.map((row) => ({ data: row, isSelected: true })));
      }
   };

   const getSelectedRows = () => selectedRows.map((r) => r.data);

   useEffect(() => {
      const filteredData = data.filter((row) => {
         return Object.values(row).some((value) => {
            return String(value).toLowerCase().includes(globalFilter.toLowerCase());
         });
      });
      setData(filteredData);
   }, [data, globalFilter]);

   const tableContext: TableContext = {
      setGlobalFilter,
      globalFilter,
      data,
      getSelectedRows,
   };

   console.log('---selectedRows---', selectedRows);
   const filteredColumns = columns.filter((col) => !col.omit);
   return (
      <div className=" w-full bg-white overflow-hidden p-6 rounded-xl flex flex-col gap-4">
         {showHeader &&
            (tableHeader ? (
               tableHeader(tableContext)
            ) : (
               <div className="flex w-full items-center justify-between">
                  <div className="flex">
                     {typeof title === 'string' ? <h1 className=" font-bold text-2xl">{title}</h1> : title}
                  </div>

                  <div className="flex gap-x-4">
                     {typeof buttonText === 'string' ? (
                        <Button leftSection={<GoPlus />} variant="filled" onClick={onPress}>
                           {props.buttonText}
                        </Button>
                     ) : (
                        buttonText
                     )}
                     <Input
                        type="text"
                        placeholder="Search ..."
                        className=" w-fit"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                     />
                  </div>
               </div>
            ))}
         <div className="flex w-full pb-5 flex-col overflow-x-scroll">
            <Table style={{ minWidth: minWidth ?? '' }} className=" w-full" {...tableProps}>
               <Table.Thead>
                  <Table.Tr>
                     <Table.Th className=" w-6" align="center">
                        <Checkbox
                           size="sm"
                           type="checkbox"
                           onChange={toggleAllRows}
                           checked={selectedRows.length === data.length}
                        />
                     </Table.Th>
                     {filteredColumns.map((column, i) => (
                        <Table.Th align={column.align} className="text-primary font-bold" key={(column.key, i)}>
                           {typeof column.header === 'function' ? column.header(tableContext) : column.header}
                        </Table.Th>
                     ))}
                  </Table.Tr>
               </Table.Thead>
               <Table.Tbody>
                  {_data.map((row, rowIndex) => (
                     <Table.Tr key={rowIndex}>
                        <Table.Td align="center">
                           <Checkbox
                              size="sm"
                              type="checkbox"
                              checked={selectedRows.some((r) => JSON.stringify(r.data) === JSON.stringify(row))}
                              onChange={() => toggleRow({ data: row, isSelected: false })}
                           />
                        </Table.Td>
                        {columns.map((column, columnIndex) => {
                           const value = column.getValue ? column.getValue(row) : getObjValue(column.key, row);
                           const cellContext: CellContext = {
                              value,
                              row: {
                                 data: row,
                                 isSelected: selectedRows.some((r) => JSON.stringify(r.data) === JSON.stringify(row)),
                              },
                              table: tableContext,
                           };
                           return (
                              <Table.Td key={columnIndex} align={column.align} style={{ textAlign: column.align }}>
                                 {column.cell ? column.cell(cellContext) : value}
                              </Table.Td>
                           );
                        })}
                     </Table.Tr>
                  ))}
                  {_data.length === 0 && (
                     <Table.Tr>
                        <Table.Td colSpan={columns.length + 1}>No data found</Table.Td>
                     </Table.Tr>
                  )}
               </Table.Tbody>
            </Table>
         </div>
         {paginate && <PaginationComponent pagination={pagination} setData={setData} data={data} />}
      </div>
   );
};

export default DataTable;
