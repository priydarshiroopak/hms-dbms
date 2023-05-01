import { React, useState } from "react";
import { useTable, useFilters, useGlobalFilter } from "react-table";
import { GlobalFilter, DefaultFilterForColumn } from "./Filter";

export default function TableContainer({ columns, data, TableName , selectedRow, setSelectedRow, identifierColumn, requiredValue }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    state,
    visibleColumns,
    prepareRow,
    setGlobalFilter,
    preGlobalFilteredRows,
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultFilterForColumn },
    },
    useFilters,
    useGlobalFilter
  );

  return (
    <table {...getTableProps()}>
      <thead>
        <tr>
          <th
            colSpan={visibleColumns.length}
            style={{
              textAlign: "center",
            }}
          >
            {/* rendering global filter */}
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
              TableName={TableName || ""}
            />
          </th>
        </tr>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => !column.invisible && (
              <th {...column.getHeaderProps()}>
                {column.render("Header")}
                {/* rendering column filter */}
                <div>{column.canFilter ? column.render("Filter") : null}</div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} onClick={()=> setSelectedRow(row)}
              className={selectedRow === row.values[identifierColumn]? "selected": ""}>
              {row.cells.map((cell) => 
                !cell.column.invisible && <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
