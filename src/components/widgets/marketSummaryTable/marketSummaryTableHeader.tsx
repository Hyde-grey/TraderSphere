import { flexRender, Table } from "@tanstack/react-table";
import styles from "../widgets.module.css";
import { MarketData } from "./marketSummaryTableConfig";

type MarketSummaryTableHeaderProps = {
  table: Table<MarketData>;
};

const MarketSummaryTableHeader = ({ table }: MarketSummaryTableHeaderProps) => {
  return (
    <>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th key={header.id}>
              {flexRender(header.column.columnDef.header, header.getContext())}
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
    </>
  );
};

export default MarketSummaryTableHeader;
