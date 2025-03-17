import { flexRender, HeaderGroup } from "@tanstack/react-table";
import styles from "../widgets.module.css";
import { MarketData } from "./marketSummaryTableConfig";

type MarketSummaryTableHeaderProps = {
  tableHeaders: HeaderGroup<MarketData>[];
};

const MarketSummaryTableHeader = ({
  tableHeaders,
}: MarketSummaryTableHeaderProps) => {
  return (
    <>
      {tableHeaders.map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              style={{ width: `${100 / headerGroup.headers.length}%` }}
            >
              <div className={styles.headerContent}>
                <h3>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </h3>
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
              </div>
            </th>
          ))}
        </tr>
      ))}
    </>
  );
};

export default MarketSummaryTableHeader;
