import { flexRender, Table } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import styles from "../widgets.module.css";
import { MarketData } from "./marketSummaryTableConfig";

type MarketSummaryTableBodyProps = {
  table: Table<MarketData>;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

const ROW_HEIGHT = 45;
//minor = pass column count and rows
const MarketSummaryTableBody = ({
  table,
  containerRef,
}: MarketSummaryTableBodyProps) => {
  const columnCount = table.getAllColumns().length;

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <tbody>
      {!!rows.length ? (
        <>
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <tr key={row.id} className={styles.dataRow}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </>
      ) : (
        <tr>
          <td colSpan={columnCount} className={styles.noData}>
            <span>No data available</span>
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default MarketSummaryTableBody;
