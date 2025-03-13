import { useState, useRef, useEffect } from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useProcessMarketData } from "./useProcessMarketData";
import { columns } from "./marketSummaryTableConfig";

import styles from "../widgets.module.css";
import MarketSummaryTableHeader from "./marketSummaryTableHeader";
import MarketSummaryTableBody from "./marketSummaryTableBody";
import PaginationControls from "./PafinationControls";

const MarketSummaryTable = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const {
    marketData: data,
    loading,
    error,
    isConnected,
    liveError,
  } = useProcessMarketData();

  const containerRef = useRef<HTMLDivElement>(null);
  const [tableHeight, setTableHeight] = useState<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    setTableHeight(containerRef.current.clientHeight);

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const height = entry.contentRect.height;
        setTableHeight(height);
      }
    });

    resizeObserver.observe(containerRef.current);

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

      <div
        ref={containerRef}
        className={styles.virtualTableContainer}
        style={{ overflow: "auto" }}
      >
        <table className={styles.table}>
          <thead>
            <MarketSummaryTableHeader table={table} />
          </thead>
          <MarketSummaryTableBody table={table} containerRef={containerRef} />
        </table>
      </div>
      <PaginationControls table={table} />
    </div>
  );
};

export default MarketSummaryTable;
