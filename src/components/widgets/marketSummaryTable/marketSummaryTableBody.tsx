import { flexRender, Table } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import styles from "../widgets.module.css";
import { MarketData } from "./marketSummaryTableConfig";
import { useSymbolContext } from "../../../contexts/SymbolContext";

type MarketSummaryTableBodyProps = {
  table: Table<MarketData>;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

const ROW_HEIGHT = 45;
const OVERSCAN = 20;

const MarketSummaryTableBody = ({
  table,
  containerRef,
}: MarketSummaryTableBodyProps) => {
  const { setSelectedSymbol } = useSymbolContext();
  const columnCount = table.getAllColumns().length;
  const columnWidth = `${100 / columnCount}%`;

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
    measureElement: (element) => element.getBoundingClientRect().height,
    initialRect: { width: 0, height: 0 },
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  return (
    <tbody style={{ height: `${totalSize}px` }}>
      {!!rows.length ? (
        <>
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <tr
                onClick={() => setSelectedSymbol(row.id)}
                key={row.id}
                className={styles.dataRow}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} style={{ width: columnWidth }}>
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
