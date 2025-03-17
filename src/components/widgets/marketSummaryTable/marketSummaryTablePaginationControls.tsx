import { Table } from "@tanstack/react-table";
import styles from "../widgets.module.css";
import { MarketData } from "./marketSummaryTableConfig";

type PaginationControlsProps = {
  table: Table<MarketData>;
};

const PaginationControls = ({ table }: PaginationControlsProps) => {
  return (
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
  );
};

export default PaginationControls;
