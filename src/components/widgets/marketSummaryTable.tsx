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
import { useVirtualizer } from "@tanstack/react-virtual";

import styles from "./widgets.module.css";
import { useState, useRef, useEffect } from "react";
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
    pageSize: 50,
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

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const [tableHeight, setTableHeight] = useState<number>(0);

  // Setup resize observer to handle dynamic container height
  useEffect(() => {
    if (!tableContainerRef.current) return;

    // Get initial height
    setTableHeight(tableContainerRef.current.clientHeight);

    // Setup resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const height = entry.contentRect.height;
        setTableHeight(height);
      }
    });

    resizeObserver.observe(tableContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

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

  // Define a fixed row height constant
  const ROW_HEIGHT = 45; // pixels

  // Setup virtualizer with fixed row height
  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => ROW_HEIGHT, // Use the fixed row height constant
    overscan: 10, // number of items to render outside of the visible area
    scrollMargin: tableHeight,
  });

  // Get virtualized rows
  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize -
        (virtualRows[virtualRows.length - 1].start +
          virtualRows[virtualRows.length - 1].size)
      : 0;

  // Calculate if we need a spacer to prevent row stretching
  const containerHeight = tableHeight || 0;
  const visibleRowsHeight = virtualRows.length * ROW_HEIGHT;
  const needsSpacer = containerHeight > visibleRowsHeight && rows.length > 0;
  const spacerHeight = needsSpacer ? containerHeight - visibleRowsHeight : 0;

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

      {/* Virtualized table container with flexible height */}
      <div ref={tableContainerRef} className={styles.virtualTableContainer}>
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
                          value={
                            (header.column.getFilterValue() as string) ?? ""
                          }
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
            {rows.length > 0 ? (
              <>
                {/* Add padding space at the top */}
                {paddingTop > 0 && (
                  <tr className={styles.paddingRow}>
                    <td
                      style={{ height: `${paddingTop}px` }}
                      colSpan={columns.length}
                    />
                  </tr>
                )}

                {/* Render only the visible items */}
                {virtualRows.map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  return (
                    <tr key={row.id} className={styles.dataRow}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}

                {/* Add padding space at the bottom */}
                {paddingBottom > 0 && (
                  <tr className={styles.paddingRow}>
                    <td
                      style={{ height: `${paddingBottom}px` }}
                      colSpan={columns.length}
                    />
                  </tr>
                )}

                {/* Add extra spacer when needed to prevent stretching */}
                {needsSpacer && (
                  <tr className={`${styles.paddingRow} ${styles.bottomSpacer}`}>
                    <td
                      style={{ height: `${spacerHeight}px` }}
                      colSpan={columns.length}
                    />
                  </tr>
                )}
              </>
            ) : (
              <tr>
                <td colSpan={columns.length} className={styles.noData}>
                  <span>No data available</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
          {[10, 20, 50, 100].map((pageSize) => (
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
