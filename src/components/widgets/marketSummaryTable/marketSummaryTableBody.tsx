import { flexRender, Table } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import styles from "../widgets.module.css";
import { MarketData } from "./marketSummaryTableConfig";
import { useEffect, useRef, useState } from "react";

type MarketSummaryTableBodyProps = {
  table: Table<MarketData>;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

const MarketSummaryTableBody = ({
  table,
  containerRef,
}: MarketSummaryTableBodyProps) => {
  const [tableHeight, setTableHeight] = useState<number>(0);

  const columnCount = table.getAllColumns().length;

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
  }, [containerRef]);

  const ROW_HEIGHT = 45;

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    rows.length > 0
      ? totalSize - (paddingTop + virtualRows.length * ROW_HEIGHT)
      : 0;

  return (
    <tbody>
      {rows.length > 0 ? (
        <>
          {paddingTop > 0 && (
            <tr>
              <td
                colSpan={columnCount}
                style={{ height: `${paddingTop}px`, padding: 0 }}
              />
            </tr>
          )}

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

          {paddingBottom > 0 && (
            <tr>
              <td
                colSpan={columnCount}
                style={{ height: `${paddingBottom}px`, padding: 0 }}
              />
            </tr>
          )}
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
