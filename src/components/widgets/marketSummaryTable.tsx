import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
  FilterFn,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import styles from "./widgets.module.css";
import { useState } from "react";
import { useProcessMarketData } from "./useProcessMarketData";

type MarketData = {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  volume: string;
};

const columns: ColumnDef<MarketData>[] = [
  {
    header: "Symbols",
    accessorKey: "symbol",
    cell: ({ row }) => <span>{row.original.symbol}</span>,
    filterFn: "includesString",
  },
  {
    header: "Price",
    accessorKey: "lastPrice",
    filterFn: "includesString",
    cell: ({ row }) => (
      <span>
        $
        {parseFloat(row.original.lastPrice).toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}
      </span>
    ),
  },
  {
    header: "24h Change",
    accessorKey: "priceChangePercent",
    filterFn: "inNumberRange",
    cell: ({ row }) => {
      const value = parseFloat(row.original.priceChangePercent);
      const isPositive = value >= 0;
      return (
        <span className={isPositive ? styles.positive : styles.negative}>
          {value > 0 ? "+" : ""}
          {value.toFixed(2)}%
        </span>
      );
    },
  },
  {
    header: "Volume",
    accessorKey: "volume",
    filterFn: "includesString",
    cell: ({ row }) => {
      const volume = parseFloat(row.original.volume);
      return <span>{volume.toLocaleString("en-US")}</span>;
    },
  },
];

const MarketSummaryTable = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // const { data, loading, error } = useFetchData("ticker/24hr");
  const {
    marketData: data,
    loading,
    error,
    isConnected,
    liveError,
  } = useProcessMarketData();

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    autoResetPageIndex: false,
    getRowId: (row) => row.symbol,
    state: {
      pagination,
      globalFilter,
      columnFilters,
    },

    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
  });

  if (loading)
    return (
      <div className={styles.loading}>
        <h2>Loading market data...</h2>
      </div>
    );
  if (error)
    return (
      <div className={styles.error}>
        <h2>Error loading market data</h2>
      </div>
    );

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableSearch}>
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search all columns..."
          className={styles.searchInput}
        />
      </div>
      <table className={styles.table}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getCanFilter() && (
                    <div className={styles.columnFilter}>
                      <input
                        value={(header.column.getFilterValue() as string) ?? ""}
                        onChange={(e) =>
                          header.column.setFilterValue(e.target.value)
                        }
                        placeholder={`Filter ${header.column.id}...`}
                        className={styles.columnFilterInput}
                      />
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className={styles.noData}>
                <span> No data available</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={styles.paginationButton}
        >
          Previous
        </button>

        <span className={styles.pageInfo}>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={styles.paginationButton}
        >
          Next
        </button>

        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className={styles.pageSizeSelect}
        >
          {[5, 10, 20, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MarketSummaryTable;
